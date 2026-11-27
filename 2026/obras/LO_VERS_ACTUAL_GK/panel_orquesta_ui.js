// Max 9 / v8ui. Tres líneas de tiempo absolutas comparten el reloj de la obra.
autowatch = 0;
inlets = 1;
outlets = 1;
setinletassist(0, () => assist('inicio | pausa | continuar | stop | reiniciar | partitura archivo.json | reload'));
setoutletassist(0, () => assist('inicio | preset N | instruccion N | movimiento 0/1 | fin | pausa | continuar | stop | reiniciar'));

const g = mgraphics;
g.init();
g.relative_coords = 0;
g.autofill = 0;

const owner = this;
const lanes = ['presets', 'instrucciones', 'movimiento'];
const movementLabel = {muevete: 'Muévete', quieto: 'Quieto'};
let filename = 'partitura_laptop.json';
let score = null;
let scoreFolder = '';
let loadError = '';
let phase = 'ready';
let startedAt = 0;
let elapsed = 0;
let active = [-1, -1, -1];
let image = null;
let imageUnavailable = false;

const clock = new Task(tick, this);
clock.interval = 50;

function init() {
    if (!score) partitura(filename);
}

function isAbsolute(path) {
    return /^(?:\/|[A-Za-z]:|[^/]+:\/)/.test(path);
}

function patcherRelative(path) {
    if (isAbsolute(path)) return path;
    const patchPath = owner.patcher.filepath || '';
    const separator = Math.max(patchPath.lastIndexOf('/'), patchPath.lastIndexOf('\\'));
    return separator < 0 ? path : patchPath.slice(0, separator + 1) + path;
}

function partitura() {
    const requested = arrayfromargs(arguments).join(' ');
    if (!requested || phase === 'running' || phase === 'paused') return;
    let file = new File(patcherRelative(requested), 'read');
    if (!file.isopen) file = new File(requested, 'read');
    try {
        if (!file.isopen) throw new Error('No se pudo abrir ' + requested);
        const folder = file.foldername;
        const encoded = file.readbytes(file.eof).map(byte => '%' + (byte & 255).toString(16).padStart(2, '0')).join('');
        const data = compileScore(JSON.parse(decodeURIComponent(encoded).replace(/^\uFEFF/, '')));
        filename = requested;
        scoreFolder = folder.replace(/[\\/]$/, '');
        score = data;
        loadError = '';
        resetDisplay();
    } catch (error) {
        loadError = String(error.message || error);
        post('Panel orquesta: ' + loadError + '\n');
        g.redraw();
    } finally {
        if (file.isopen) file.close();
    }
}

function readTime(value) {
    if (Number.isFinite(value) && value >= 0) return value;
    if (typeof value === 'string' && /^\d+:[0-5]\d(?:\.\d+)?$/.test(value)) {
        const [minutes, seconds] = value.split(':').map(Number);
        const total = minutes * 60 + seconds;
        if (Number.isFinite(total)) return total;
    }
    throw new Error('Tiempo inválido. Usa MM:SS o segundos numéricos.');
}

function compileScore(data) {
    if (!data || typeof data.laptop !== 'string' || !data.laptop.trim()) throw new Error('Indica el nombre en laptop.');
    const end = readTime(data.fin);
    if (end <= 0) throw new Error('El tiempo de fin debe ser mayor que cero.');
    const timelines = lanes.map(lane => {
        const entries = data[lane];
        if (!Array.isArray(entries)) throw new Error('Se requiere una lista en ' + lane + '.');
        let previous = -1;
        return entries.map((entry, index) => {
            const location = lane + ', entrada ' + (index + 1);
            if (!entry || typeof entry !== 'object') throw new Error('Revisa ' + location + '.');
            const at = readTime(entry.en);
            if (at <= previous || at >= end) throw new Error('Ordena los tiempos antes del fin en ' + location + '.');
            previous = at;
            if (lane === 'presets' && (!Number.isInteger(entry.numero) || entry.numero < 1 || entry.numero > 9)) {
                throw new Error('Usa un número del 1 al 9 en ' + location + '.');
            }
            if (lane === 'instrucciones' && (typeof entry.titulo !== 'string' || typeof entry.texto !== 'string' ||
                (entry.imagen !== undefined && typeof entry.imagen !== 'string'))) {
                throw new Error('Revisa titulo, texto e imagen en ' + location + '.');
            }
            if (lane === 'movimiento' && !Object.prototype.hasOwnProperty.call(movementLabel, entry.estado)) {
                throw new Error('Usa muevete o quieto en ' + location + '.');
            }
            return {...entry, at};
        });
    });
    return {laptop: data.laptop, end, timelines};
}

function reload() {
    partitura(filename);
}

function indexAt(entries, time) {
    let index = entries.length - 1;
    while (index >= 0 && entries[index].at > time) index--;
    return index;
}

function loadImage(path) {
    if (image) image.freepeer();
    image = null;
    imageUnavailable = false;
    if (!path) return;
    const resolved = isAbsolute(path) || !scoreFolder ? path : scoreFolder + '/' + path;
    const file = new File(resolved, 'read');
    if (!file.isopen) {
        imageUnavailable = true;
        return;
    }
    file.close();
    try {
        image = new Image(resolved);
        imageUnavailable = !image.size[0] || !image.size[1];
    } catch (error) {
        imageUnavailable = true;
    }
}

function resetDisplay() {
    clock.cancel();
    phase = 'ready';
    elapsed = 0;
    active = score ? score.timelines.map(entries => indexAt(entries, 0)) : [-1, -1, -1];
    loadImage(score && score.timelines[1][active[1]]?.imagen);
    g.redraw();
}

function reiniciar() {
    const hadStarted = phase !== 'ready';
    resetDisplay();
    if (hadStarted) {
        outlet(0, 'movimiento', 0);
        outlet(0, 'reiniciar');
    }
}

function inicio() {
    if (!score || phase !== 'ready') return;
    startedAt = Date.now();
    phase = 'running';
    outlet(0, 'inicio');
    if (phase !== 'running') return;
    emitLane(0);
    emitLane(1);
    emitLane(2);
    if (phase === 'running') clock.repeat();
    g.redraw();
}

function pausa() {
    if (phase !== 'running') return;
    tick();
    if (phase !== 'running') return;
    clock.cancel();
    phase = 'paused';
    outlet(0, 'movimiento', 0);
    outlet(0, 'pausa');
    g.redraw();
}

function continuar() {
    if (phase !== 'paused') return;
    startedAt = Date.now() - elapsed * 1000;
    phase = 'running';
    outlet(0, 'continuar');
    emitLane(2);
    if (phase === 'running') clock.repeat();
    g.redraw();
}

function stop() {
    if (phase !== 'running' && phase !== 'paused') return;
    if (phase === 'running') tick();
    if (phase !== 'running' && phase !== 'paused') return;
    clock.cancel();
    phase = 'stopped';
    outlet(0, 'movimiento', 0);
    outlet(0, 'stop');
    g.redraw();
}

function emitLane(lane) {
    if (phase !== 'running') return;
    const entry = score.timelines[lane][active[lane]];
    if (lane === 0 && entry) outlet(0, 'preset', entry.numero);
    if (lane === 1 && entry) outlet(0, 'instruccion', active[lane] + 1);
    if (lane === 2) outlet(0, 'movimiento', entry?.estado === 'muevete' ? 1 : 0);
}

function tick() {
    if (phase !== 'running') return;
    elapsed = Math.min(score.end, Math.max(elapsed, (Date.now() - startedAt) / 1000));
    if (elapsed === score.end) {
        phase = 'done';
        clock.cancel();
        loadImage();
        outlet(0, 'movimiento', 0);
        outlet(0, 'fin');
        g.redraw();
        return;
    }
    score.timelines.forEach((entries, lane) => {
        if (phase !== 'running') return;
        const next = active[lane] + 1;
        if (!entries[next] || entries[next].at > elapsed) return;
        active[lane] = indexAt(entries, elapsed);
        if (lane === 1) loadImage(entries[active[lane]].imagen);
        emitLane(lane);
    });
    g.redraw();
}

// Interfaz. Las medidas se calculan sobre un lienzo de 1180 × 312.
const width = 1180;
const height = 312;
const palette = {
    bg: [0.047, 0.070, 0.106, 1], card: [0.085, 0.119, 0.172, 1],
    border: [0.16, 0.21, 0.28, 1], ink: [0.94, 0.96, 0.99, 1],
    muted: [0.65, 0.72, 0.81, 1], dim: [0.43, 0.49, 0.57, 1],
    green: [0.46, 0.91, 0.74, 1], darkGreen: [0.11, 0.25, 0.23, 1],
    red: [1, 0.70, 0.69, 1], darkRed: [0.36, 0.16, 0.20, 1],
    blue: [0.72, 0.80, 1, 1], darkBlue: [0.17, 0.23, 0.38, 1]
};
const transport = [
    {box: [740, 20, 128, 36], title: 'Comenzar obra', enabled: () => score && phase === 'ready', action: inicio},
    {box: [878, 20, 94, 36], title: 'Pausa', enabled: () => phase === 'running' || phase === 'paused',
        action: () => phase === 'paused' ? continuar() : pausa()},
    {box: [982, 20, 68, 36], title: 'Stop', enabled: () => phase === 'running' || phase === 'paused', action: stop},
    {box: [1060, 20, 102, 36], title: 'Reiniciar', enabled: () => phase !== 'ready', action: reiniciar}
];
let scale = 1;
let offsetX = 0;
let offsetY = 0;

function rect(x, y, w, h, color, radius = 0) {
    if (w <= 0 || h <= 0) return;
    g.set_source_rgba(palette[color]);
    if (radius) {
        const r = Math.min(radius, w / 2, h / 2) * scale;
        g.rectangle_rounded(offsetX + x * scale, offsetY + y * scale, w * scale, h * scale, r, r);
    } else {
        g.rectangle(offsetX + x * scale, offsetY + y * scale, w * scale, h * scale);
    }
    g.fill();
}

function font(size, bold) {
    if (bold) g.select_font_face('Arial', 'bold');
    else g.select_font_face('Arial');
    g.set_font_size(size * scale);
}

function fitted(value, maxWidth) {
    if (g.text_measure(value)[0] <= maxWidth * scale) return value;
    let characters = Array.from(value);
    while (characters.length && g.text_measure(characters.join('') + '…')[0] > maxWidth * scale) characters.pop();
    return characters.join('') + '…';
}

function label(value, x, y, size, color, bold = false, maxWidth = 900, align = 'left') {
    font(size, bold);
    const text = fitted(value, maxWidth);
    const textWidth = g.text_measure(text)[0];
    const shift = align === 'center' ? textWidth / 2 : align === 'right' ? textWidth : 0;
    g.set_source_rgba(palette[color]);
    g.move_to(offsetX + x * scale - shift, offsetY + y * scale);
    g.show_text(text);
}

function wrap(value, available) {
    const lines = [];
    for (const paragraph of value.split('\n')) {
        let line = '';
        for (const word of paragraph.trim().split(/\s+/)) {
            const combined = line ? line + ' ' + word : word;
            if (line && g.text_measure(combined)[0] > available * scale) {
                lines.push(line);
                line = word;
            } else line = combined;
        }
        lines.push(line);
    }
    return lines;
}

function instruction(value, available) {
    let size = 23;
    let lines;
    for (; size >= 17; size -= 2) {
        font(size, false);
        lines = wrap(value, available);
        if (lines.length * (size + 7) <= 110) break;
    }
    size = Math.max(size, 17);
    const maxLines = Math.floor(110 / (size + 7));
    if (lines.length > maxLines) lines[maxLines - 1] += ' …';
    lines.slice(0, maxLines).forEach((line, row) => label(line, 36, 184 + row * (size + 7), size, 'ink', false, available));
}

function drawImage() {
    const [w, h] = image.size;
    const fit = Math.min(168 / w, 110 / h);
    g.save();
    g.translate(offsetX + (450 + (168 - w * fit) / 2) * scale, offsetY + (146 + (110 - h * fit) / 2) * scale);
    g.scale(fit * scale, fit * scale);
    g.image_surface_draw(image);
    g.restore();
}

function clockText(seconds) {
    const whole = Math.floor(seconds);
    return String(Math.floor(whole / 60)).padStart(2, '0') + ':' + String(whole % 60).padStart(2, '0');
}

function laneView(lane) {
    const entries = score?.timelines[lane];
    if (!entries?.length || phase === 'done') return {current: null, next: null, remaining: null, fraction: 0};
    const current = entries[active[lane]];
    const next = entries[active[lane] + 1];
    const until = next ? next.at : score.end;
    const remaining = Math.max(0, until - elapsed);
    return {current, next, remaining, fraction: remaining / (until - (current?.at ?? 0))};
}

function bar(view, x, y, w, color) {
    rect(x, y, w, 7, 'border', 4);
    rect(x, y, w * view.fraction, 7, color, 4);
}

function remainingText(view) {
    return view.remaining === null ? '—' : Math.ceil(view.remaining) + ' s';
}

function preview(view, name) {
    if (view.remaining === null) return '—';
    return view.next ? clockText(view.next.at) + ' · ' + name(view.next) : 'Hasta el final';
}

function paint() {
    const [canvasW, canvasH] = g.size;
    scale = Math.min(canvasW / width, canvasH / height);
    if (scale <= 0) return;
    offsetX = (canvasW - width * scale) / 2;
    offsetY = (canvasH - height * scale) / 2;
    g.set_source_rgba(palette.bg);
    g.rectangle(0, 0, canvasW, canvasH);
    g.fill();

    label(clockText(elapsed), 17, 53, 40, 'ink', true, 150);
    rect(156, 19, 1, 39, 'border');
    label(score ? score.laptop : 'Orquesta de laptops', 176, 34, 20, 'ink', true, 542);
    const statuses = {ready: score ? 'En espera' : 'Carga una partitura', running: 'En curso',
        paused: 'En pausa', stopped: 'Obra detenida', done: 'Obra terminada'};
    label(loadError || statuses[phase], 177, 55, 14, loadError ? 'red' : 'muted', false, 542);
    for (const control of transport) {
        const [x, y, w, h] = control.box;
        const enabled = control.enabled();
        const highlighted = enabled && (control.action === inicio || (phase === 'paused' && control.title === 'Pausa'));
        const caption = phase === 'paused' && control.title === 'Pausa' ? 'Continuar' : control.title;
        rect(x, y, w, h, highlighted ? 'green' : enabled ? 'border' : 'card', 7);
        label(caption, x + w / 2, y + 23, 14, highlighted ? 'bg' : enabled ? 'ink' : 'dim', true, w - 8, 'center');
    }

    const gesture = laneView(1);
    const hasImage = image && !imageUnavailable;
    const textWidth = hasImage || imageUnavailable ? 395 : 582;
    rect(18, 72, 618, 222, 'card', 12);
    label('INSTRUCCIÓN ACTUAL', 36, 101, 13, 'blue', true);
    label(remainingText(gesture), 618, 101, 14, 'ink', true, 94, 'right');
    bar(gesture, 36, 111, 582, 'blue');
    label(gesture.current?.titulo || '—', 36, 152, 30, 'ink', true, textWidth);
    if (gesture.current?.texto) instruction(gesture.current.texto, textWidth);
    if (hasImage) drawImage();
    if (imageUnavailable) {
        rect(450, 146, 168, 110, 'border', 6);
        label('Imagen no disponible', 534, 206, 13, 'muted', false, 155, 'center');
    }
    label('SIGUIENTE', 36, 275, 11, 'muted', true);
    label(preview(gesture, entry => entry.titulo || 'Pausa'), 113, 275, 15, 'ink', true, 505);

    const motion = laneView(2);
    const suspended = phase === 'paused' || phase === 'stopped';
    const moving = !suspended && motion.current?.estado === 'muevete';
    const motionColor = moving ? 'green' : 'red';
    rect(650, 72, 280, 222, moving ? 'darkGreen' : 'card', 12);
    label('MOVIMIENTO', 668, 101, 13, 'muted', true);
    label(remainingText(motion), 912, 101, 14, 'ink', true, 94, 'right');
    bar(motion, 668, 111, 244, suspended ? 'dim' : motionColor);
    label(score ? (moving ? 'Muévete' : 'Quieto') : '—', 668, 189, 43, score ? motionColor : 'muted', true, 244);
    label('SIGUIENTE', 668, 252, 11, 'muted', true);
    label(preview(motion, entry => movementLabel[entry.estado]), 668, 275, 15, 'ink', true, 244);

    const preset = laneView(0);
    rect(944, 72, 218, 222, 'card', 12);
    label('PRESET ACTUAL', 962, 101, 13, 'muted', true);
    label(remainingText(preset), 1144, 101, 14, 'ink', true, 70, 'right');
    bar(preset, 962, 111, 182, 'blue');
    label(preset.current ? String(preset.current.numero) : '—', 962, 189, 43, 'ink', true, 182);
    label('SIGUIENTE PRESET', 962, 252, 11, 'muted', true);
    label(preview(preset, entry => 'Preset ' + entry.numero), 962, 275, 15, 'ink', true, 182);
}

function onclick(px, py) {
    const localX = (px - offsetX) / scale;
    const localY = (py - offsetY) / scale;
    for (const control of transport) {
        const [x, y, w, h] = control.box;
        if (control.enabled() && localX >= x && localX < x + w && localY >= y && localY < y + h) {
            control.action();
            return;
        }
    }
}

for (const helper of [isAbsolute, patcherRelative, readTime, compileScore, indexAt, loadImage, resetDisplay,
    emitLane, tick, rect, font, fitted, label, wrap, instruction, drawImage, clockText,
    laneView, bar, remainingText, preview]) helper.local = 1;
