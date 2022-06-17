import { sanitizeSVG } from '../lib'
import { readFileSync } from 'fs'
import { join } from 'path'

describe('sanitizeSVG string', () => {
	test('Clean svg', async () => {
		const cleanSvg = readFileSync(join(__dirname, 'clean-svg.svg'), 'utf8')
		const svg = await sanitizeSVG(cleanSvg)
		expect(svg).toBe(cleanSvg)
	})

	test('Evil svg', async () => {
		const evilSvg = readFileSync(join(__dirname, 'evil-svg.svg'), 'utf8')
		const svg = await sanitizeSVG(evilSvg)
		expect(svg).toBeNull()
	})
})

describe('sanitizeSVG buffer', () => {
	test('Clean svg', async () => {
		const cleanSvg = Buffer.from((readFileSync(join(__dirname, 'clean-svg.svg'), 'utf8')))
		const svg = await sanitizeSVG(cleanSvg)
		expect(svg).toBe(cleanSvg)
	})

	test('Evil svg', async () => {
		const evilSvg = Buffer.from((readFileSync(join(__dirname, 'evil-svg.svg'), 'utf8')))
		const svg = await sanitizeSVG(evilSvg)
		expect(svg).toBeNull()
	})
})

describe('sanitizeSVG invalid', () => {
	test('Invalid null svg', async () => {
		await expect(sanitizeSVG(null)).rejects.toThrow('Not an svg')
	})

	test('Invalid non-svg file', async () => {
		const imageFile = Buffer.from((readFileSync(join(__dirname, 'logo.png'), 'utf8')))
		await expect(sanitizeSVG(imageFile)).rejects.toThrow('Not an svg')
	})

	test('Invalid non-svg file', async () => {
		await expect(sanitizeSVG('Lorem ipsum dolor sit amet, consetetur sadipscing elitr.')).rejects.toThrow('Not an svg')
	})
})
