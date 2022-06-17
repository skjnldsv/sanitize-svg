import isSvg from 'is-svg'

const readAsText = (svg: File | Buffer) =>
	new Promise<string | null>((resolve) => {
		if (!isFile(svg)) {
			resolve(svg.toString('utf-8'))
		} else {
			const fileReader = new FileReader()
			fileReader.onload = () => {
				resolve(fileReader.result as string | null)
			}
			fileReader.readAsText(svg)
		}
	})

const isFile = (obj: File | Buffer): obj is File => {
	return (obj as File).size !== undefined
}

export const sanitizeSVG = async (svg: Buffer | File | string | null) => {
	if (!svg) {
		throw new Error('Not an svg')
	}

	let svgText = ''
	if (svg instanceof Buffer || svg instanceof File) {
		svgText = await readAsText(svg) as string
	} else {
		svgText = svg
	}

	if (!isSvg(svgText)) {
		throw new Error('Not an svg')
	}

	const div = document.createElement('div')
	div.innerHTML = svgText
	const svgEl = div.firstElementChild!
	const attributes = Array.from(svgEl.attributes).map(({ name }) => name)
	const hasScriptAttr = !!attributes.find((attr) => attr.startsWith('on'))
	const scripts = svgEl.getElementsByTagName('script')

	return scripts.length === 0 && !hasScriptAttr ? svg : null
}
