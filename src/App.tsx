import { FC, useEffect, useMemo, useState } from "react"
import { useLetter } from "./letter.hook"
import "./style.css"


const getWord = (word?: string) => {
	const WORDS = ["kamil", 'tata', 'auto', 'kubek'].map(x => x.toUpperCase()).filter(x => x !== word)
	const i = (Math.floor(Math.random()*99)) % WORDS.length
	const w = WORDS[i]
	console.log({w, i})
	return w
}

export const App: FC<{name: string}> = ({name}) => {
	const [pos, setPos] = useState(0)

	const [showHint, setShowHint] = useState(true)


	const [word, setWord] = useState(getWord())

	useEffect(() => {
		const time = setTimeout(() => setShowHint(true), 10000)

		return () => clearTimeout(time)
	}, [pos])

	const letter = useMemo(() => word[pos] ?? "", [pos, word])

	const {showImage, score, isError, setShowImage} = useLetter(letter, () => {
		setPos((x) => {
			setShowHint(false)
			if (x + 1 === word.length) {
				if(Math.random() < 0.2)
				setShowImage()
				setTimeout(() => {
					setShowHint(true)
					setPos(0)
					setWord(getWord())
					
				}, 5000)
			}
			return x + 1
		})
	})

	return (
		<div style={{background: pos === word.length ? "green" : undefined}}>
			<small>{score}</small>
			<div>
				{Array.from(word).map((x, i) => (
					<span
						style={{
							fontSize: "6em",
							color: i < pos ? "black" : showHint ? "#eee" : "white",
						}}
					>
						{x}
					</span>
				))}
			</div>
			{showImage ? (
				<img src={showImage} />
			) : (
				<div
					style={{...(isError ? {color: "red"} : undefined), fontSize: "240px"}}
				>
					{/* {letter.toUpperCase()} {letter.toLowerCase()} */}
				</div>
			)}
		</div>
	)
}
