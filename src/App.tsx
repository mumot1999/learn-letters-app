import {FC, useEffect, useMemo, useState} from "react"
import "./style.css"
import {cars, motory} from "./cars"
import {letters} from "./letters-mp3"

export const App: FC<{name: string}> = ({name}) => {
	const [letter, setLetter] = useState("A")
	const [showImage, setShowImage] = useState<string>()

	const [score, setScore] = useState(0)
	const [nextScore, setNextScore] = useState(0)

	const [isError, setIsError] = useState(false)

  const [loading, setLoading] = useState(true)

	const generateNewLetter = (): string => {
		const lettersKeys = Object.keys(letters).map((x) => x.toUpperCase())

		return lettersKeys[Math.floor(Math.random() * lettersKeys.length)]
	}

  const lettersMp3 = useMemo( () => Object.fromEntries(Object.entries(letters).map(([k, v]) => [k, new Audio(v)])), [])

  
  // useEffect(() => {
  //   Object.values(lettersMp3).reduce<Promise<unknown>>(async (a,b) => {
  //   await a
  //   await new Promise(r => setTimeout(r, 1000))

  //   return b.play()
  // }, Promise.resolve()).then(() => {setLoading(false)})
  // }, [])

  // if(loading) {
  //   return null
  // }

	useEffect(() => {

    const play = () => {
				lettersMp3[letter.toLowerCase()]?.play().catch(e => console.log(e))
    }

    let interval 
		try {
			if (showImage === undefined) {
        play()
        interval = setInterval(() => {play()}, 3000)
      }
		} catch(e) {
      console.log(e)
		}

    return () => {clearInterval(interval)}
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
					if (lastPressedLetter === letter) {
						setIsError(false)
						setScore((score) => score + 1)
						const images = [...cars, ...motory]

						const shouldShowImage = nextScore <= score + 1

						if (shouldShowImage) {
							setNextScore((score) => score + Math.floor(Math.random() * 3) + 1)
							setShowImage(images[Math.floor(Math.random() * images.length)])

							setTimeout(() => {
								setShowImage(undefined)
							}, 5000)
						}


						setLetter(letter => {
									const lettersKeys = Object.keys(letters).map((x) => x.toUpperCase())

							return lettersKeys[(lettersKeys.indexOf(letter) + 1) % lettersKeys.length]
						})
						// setLetter(generateNewLetter())
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

	return (
		<div>
			<small>{score}</small>
			{showImage ? (
				<img src={showImage} />
			) : (
				<h1 style={isError ? {color: "red"} : undefined}>{letter}</h1>
			)}
		</div>
	)
}
