import { useSelector } from 'react-redux'

export default function ThemeProvider(props) {
    const { theme } = useSelector(state => state.theme)

    return (
        <div className={theme}>
            <div className="bg-white text-gray-700 dark:text-gray-500 dark:bg-[rgb(16,23,42)] min-h-screen">
                {props.children}
            </div>
        </div>
    )
}
