import { useRef, useState, useEffect } from 'react'
import { Container, Top, Button, ButtonMobileOnly } from '../playground.styles'
import SassIcon from '@icons/SassIcon'
import Title from 'components/Playground/Title'
import FullScreenButton from 'components/Playground/FullScreenButton'
import Editors from 'components/Playground/Editors'

const PlaygroundSass = ({
  defaultCode = '',
  defaultExtension = 'scss',
  completeScreen,
}) => {
  const element = useRef(null)
  const [code, setCode] = useState(
    localStorage.getItem('sass-code') || defaultCode
  )
  const [result, setResult] = useState('')
  const [showResult, setShowResult] = useState(false)

  const defaultOptions = {
    extension: defaultExtension,
    compressed: false,
  }

  const [options, setOptions] = useState(
    completeScreen
      ? JSON.parse(localStorage.getItem('sass-options')) || defaultOptions
      : defaultOptions
  )

  useEffect(() => {
    localStorage.setItem('sass-code', code)
    localStorage.setItem('sass-options', JSON.stringify(options))

    if (code.trim()) {
      const { extension, compressed } = options

      fetch('https://www.coded.tech/api/sass', {
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        method: 'POST',
        body: JSON.stringify({ code, extension, compressed }),
      })
        .then((res) => res.json())
        .then(({ code }) => setResult(code))
        .catch((error) => console.error(error))
    }
  }, [code, options])

  const handleToggleShowResult = () => setShowResult(!showResult)

  const handleChangeLanguage = () =>
    setOptions({
      ...options,
      extension: options.extension === 'scss' ? 'sass' : 'scss',
    })

  const handleChangeOutputStyle = () =>
    setOptions({ ...options, compressed: !options.compressed })

  return (
    <Container ref={element} completeScreen={completeScreen}>
      <Top completeScreen={completeScreen}>
        {completeScreen && <Title Icon={SassIcon} name="SASS" />}
        <FullScreenButton element={element} />
        <ButtonMobileOnly
          onClick={handleToggleShowResult}
          completeScreen={completeScreen}
        >
          {showResult ? 'Resultado' : 'Código'}
        </ButtonMobileOnly>
        {completeScreen && (
          <>
            <Button onClick={handleChangeLanguage}>
              {options.extension.toUpperCase()}
            </Button>
            <Button onClick={handleChangeOutputStyle}>
              {options.compressed ? 'Comprimido' : 'Expandido'}
            </Button>
          </>
        )}
      </Top>
      <Editors
        language={options.extension}
        handleChange={setCode}
        code={code}
        result={result}
        languageResult="css"
        showResult={showResult}
        completeScreen={completeScreen}
      />
    </Container>
  )
}

export default PlaygroundSass
