import {useEffect, useMemo, useState} from "react"
import {cars, motory} from "./cars"
import {letters} from "./letters-mp3"

export const useLetter = (letter: string, onPress: () => void) => {
	const [showImage, setShowImage] = useState<string>()

	const [isError, setIsError] = useState(false)
	const [score, setScore] = useState(0)
	const [nextScore, setNextScore] = useState(
		Math.floor(Math.random() * Math.random() * 3)
	)
	const lettersMp3 = useMemo(
		() =>
			Object.fromEntries(
				Object.entries(letters).map(([k, v]) => [k, new Audio(v)])
			),
		[]
	)

	useEffect(() => {
		const play = () => {
			lettersMp3[letter.toLowerCase()]?.play().catch((e) => console.log(e))
		}

		let interval
		try {
			if (showImage === undefined) {
				play()
				interval = setInterval(() => {
					play()
				}, 3000)
			}
		} catch (e) {
			console.log(e)
		}

		return () => {
			clearInterval(interval)
		}
	}, [letter, score, showImage])

	useEffect(() => {
		let timeout
		const handleKeyPress = async (ev: KeyboardEvent): Promise<void> => {
			window.removeEventListener("keypress", handleKeyPress)

			timeout = setTimeout(() => {
				const lastPressedLetter = ev.key.toUpperCase()

				console.log(new Date().getTime(), {
					letter,
					lastPressedLetter,
				})

				if (showImage === undefined) {
					if (lastPressedLetter === letter.toUpperCase()) {
						onPress()
						setIsError(false)
						setScore((score) => score + 1)
						const images = [...cars, ...motory]

						const shouldShowImage = nextScore <= score + 1

						if (shouldShowImage) {
							setNextScore(
								(score) =>
									score + Math.floor(Math.pow(Math.random() * 3, 2)) + 1
							)
							// setShowImage(images[Math.floor(Math.random() * images.length)])
						}
					} else if (lastPressedLetter !== undefined) {
						// setIsError(true)
					}
				}
			}, 10)
			// await new Promise((res) => setTimeout(res, 100))
			window.addEventListener("keypress", handleKeyPress)
		}

		window.addEventListener("keypress", handleKeyPress)

		return () => window.removeEventListener("keypress", handleKeyPress)
	}, [letter, showImage, score])

	return {
		score,
		showImage,
		isError,
		setShowImage: () => {
			const images = [...cars, ...motory]
			setShowImage(images[Math.floor(Math.random() * images.length)])
			setTimeout(() => {
				setShowImage(undefined)
			}, 5000)
		},
	}
}
