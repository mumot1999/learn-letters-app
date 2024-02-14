import {FC, useCallback, useEffect, useMemo, useState} from "react"
import "./style.css"
import {cars, motory} from "./cars"
import {letters} from "./letters-mp3"
import {useLetter} from "./letter.hook"

export const App: FC<{name: string}> = ({name}) => {
	const [pos, setPos] = useState(0)

	const [showHint, setShowHint] = useState(true)

	const word = "kamil".toUpperCase()

	useEffect(() => {
		const time = setTimeout(() => setShowHint(true), 10000)

		return () => clearTimeout(time)
	}, [pos])

	const letter = useMemo(() => word[pos] ?? "", [pos])

	const {showImage, score, isError, setShowImage} = useLetter(letter, () => {
		setPos((x) => {
			setShowHint(false)
			if (x + 1 === word.length) {
				setShowImage()
				setTimeout(() => {
					setShowHint(true)
					setPos(0)
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
