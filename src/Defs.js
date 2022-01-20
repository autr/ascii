
export const MODE_RECT = 'rectangle'
export const MODE_POINTER = 'pointer'
export const MODE_SELECT = 'select'
export const MODE_CHAR = 'char'
export const SPACE = '&nbsp;'
export const ALIGN_START = 'start'
export const ALIGN_CENTER = 'center'
export const ALIGN_END = 'end'
export const ALIGN_JUSTIFY = 'justify'

export const INPUT_ELEMENTS = ['textarea','number','text']

// use this:

// https://www.w3.org/TR/xml-entity-names/025.html

export const MODES = {
	[MODE_POINTER]: {},
	[MODE_SELECT]: {},
	[MODE_CHAR]: {},
	[MODE_RECT]: {}
}

export const CIRCLES = [ '⃝', '⃠', '↺', '↻', '⇴', '⌼', '⌽', '⌾', '⍉', '⍜', '⍟', '⍥', '⎋', '⏀', '⏁', '⏂', '⏣', '○', '◌', '◍', '●', '◐', '◑', '◒', '◓', '◔', '◕', '◖', '◗', '◙', '◚', '◛', '◠', '◡', '◯', '◴', '◵', '◶', '◷', '⚆', '⚇', '⚈', '⚉','⚬', '❍', '⟟', '⟲', '⟳', '⥀', '⥁', '⥈', '⥉', '⦲', '⦵', '⦺', '⦻', '⦽', '⧂', '⧃', '⧇', '⧬', '⧭', '⧲', '⧳', '⨢', '⨭', '⨮', '⨴', '⨵', '⨷', '⩹', '⩺', '⫯', '⫰', '⫱', '⬤', '⬰','￮', '𐩑', '𐩒', '𑗘', '𑗙', '𑗚', '𛲅', '𛲕']
export const INPUT_KEYS = [ 'Digit1', 'Digit2', 'Digit3', 'Digit4', 'Digit5', 'Digit6', 'Digit7', 'Digit8', 'Digit9', 'Digit0', 'Minus', 'Equal', 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash' ]

export const SQUARE_CORNERS = {
	tl: ['╭','┌','┍','┎','┏','╭','╔','╒','╓'],
	tr: ['╮','┐','┑','┒','┓','╮','╗','╕','╖'],
	bl: ['╰','└','┕','┖','┗','╰','╚','╘','╙'],
	br: ['╯','┘','┙','┚','┛','╯','╝','╛','╜'],
}

export const DIAGONAL = ['╲','╱','╳']

export const LINES = {
	v: ['│','┃','┆','┇','┊','┋','╎','╏','╽','╿','╵','╷','╹','╻'],
	h: ['─','━','┄','┅','┈','┉','╌','╍','╼','╾','╴','╶','╸','╺']
}
export const ARROWS = ['←','↑','→','↓','↔','↕','↖','↗','↘','↙','↚','↛','↜','↝','↞','↟','↠','↡','↢','↣','↤','↥','↦','↧','↨','↩','↪','↫','↬','↭','↮','↯','↰','↱','↲','↳','↴','↵','↶','↷','↸','↹','↺','↻','⇄','⇅','⇆','⇇','⇈','⇉','⇊','⇍','⇎','⇏','⇐','⇑','⇒','⇓','⇔','⇕','⇖','⇗','⇘','⇙','⇚','⇛','⇜','⇝','⇞','⇟','⇠','⇡','⇢','⇣','⇤','⇥','⇦','⇧','⇨','⇩','⇪'
]
export const BLOCKS = ['▀','▁','▂','▃','▄','▅','▆','▇','█','▉','▊','▋','▌','▍','▎','▏','▐','░','▒','▓','▔','▕','▖','▗','▘','▙','▚','▛','▜','▝','▞','▟']


export const KEYS = [ 'KeyQ', 'KeyW', 'KeyE', 'KeyR', 'KeyT', 'KeyY', 'KeyU', 'KeyI', 'KeyO', 'KeyP', 'BracketLeft', 'BracketRight', 'KeyA', 'KeyS', 'KeyD', 'KeyF', 'KeyG', 'KeyH', 'KeyJ', 'KeyK', 'KeyL', 'Semicolon', 'Quote', 'Backslash', 'KeyZ', 'KeyX', 'KeyC', 'KeyV', 'KeyB', 'KeyN', 'KeyM', 'Comma', 'Period', 'Slash' ]
export const KEYS_ICONS = [ 'Q','W','E','R','T','Y','U','I','O','P','[',']','A','S','D','F','G','H','J','K','L',';','\'','\\','Z','X','C','V','B','N','M',',','.','/']


export const LOREM = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Morbi id sagittis orci, non rhoncus velit. Nam sed tellus cursus, interdum nulla ac, iaculis libero. Nam ullamcorper nulla sem, id gravida dui posuere vitae. Morbi finibus ultrices ligula id varius. Ut lobortis ornare nisl in efficitur. Mauris viverra est malesuada, feugiat tellus in, faucibus risus. Vivamus sed lacinia diam. Cras in ullamcorper lacus, ac euismod ex.'

export const BOARDS = [
	[...KEYS_ICONS],
	[...BLOCKS],
	[...LINES.h,...LINES.v,...DIAGONAL],
	[...SQUARE_CORNERS.tl,...SQUARE_CORNERS.tr,...SQUARE_CORNERS.bl,...SQUARE_CORNERS.br],
	[...CIRCLES]
]

export const BOARD_NAMES = ['Default', 'Blocks', 'Lines', 'Corners', 'Circles']
