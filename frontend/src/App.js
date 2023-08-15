import {useState} from "react";
import './App.css';
import './style.css';
import {dictionary} from './components/dictionary.js'
import {predefinedPrompts} from './components/prompts.js'

const engineId = 'stable-diffusion-v1-5'
const apiHost = 'https://api.stability.ai';
const url = apiHost + '/v1/user/account';
const stabilityApiKey = process.env.REACT_APP_API_KEY;

function App() {
  const [userPrompt, setUserPrompt] = useState("");
  const [buttonClicked, setButtonClicked] = useState(false);
  const [base64Data, setBase64Data] = useState(''); // Initial state is an empty string
  const [isLoading, setIsLoading] = useState(false);

  const requestBackend = async () => {
    setButtonClicked(true);
    console.log('User prompt: ', userPrompt);
    let total = userPrompt + predefinedPrompts
    console.log('Completed prompt: ', total)
    let response = null;
    try {
      console.log('Waiting for response from stable diffusion...');
      const response = await fetch(
        apiHost + '/v1/generation/' + engineId+ '/text-to-image',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            Authorization: 'Bearer ' + stabilityApiKey,
          },
          body: JSON.stringify({
            text_prompts: [
              {
                text: total,
              },
            ],
            cfg_scale: 8,
            clip_guidance_preset: 'FAST_BLUE',
            height: 512,
            width: 512,
            samples: 1,
            steps: 50,
          }),
        }
      );
      const responseJSON = await response.json();
      console.log('Response from stabilityAPI: ', responseJSON);
      setBase64Data(responseJSON.artifacts[0].base64);
      setButtonClicked(false);
      setIsLoading(false)
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        {/* Custom prompt buttons */}
        {/* <div className="buttonContainer">
        {showCustomButton('Coastal',{ requestBackend, buttonClicked, setIsLoading, isLoading, setUserPrompt })}
        {showCustomButton('Forest', { requestBackend, buttonClicked, setIsLoading, isLoading, setUserPrompt })}
        {showCustomButton('Library', { requestBackend, buttonClicked, setIsLoading, isLoading, setUserPrompt })}
        </div> */}
        <div className="container">
          {showPromptTextbox( { setUserPrompt} )}
          {showButton( { requestBackend, buttonClicked, setIsLoading, isLoading } )}
        </div>
        {showStabilityImage( { base64Data } ) }
      </header>
    </div>
  );
}

function showButton({ requestBackend, buttonClicked, setIsLoading, isLoading }) {
  const handleButtonClick = () => {
    console.log('Button clicked!');
    setIsLoading(true);
    requestBackend();
  };

  return (
    <div>
      <button
        onClick={handleButtonClick}
        disabled={buttonClicked || isLoading}
        className="button"
      >
        {isLoading ? <span className="spinner"></span> : 'Submit'}
      </button>
    </div>
  );
}

function showStabilityImage({ base64Data }) {
  return (
    <div>
      {base64Data && (
        <img
          className="image"
          src={`data:image/png;base64,${base64Data}`}
          style={{ maxWidth: '100%', height: 'auto' }}
          alt="Generated Image"
        />
      )}
    </div>
  );
}

function showPromptTextbox({ setUserPrompt }) {
  const handleInputChange = (event) => {
    setUserPrompt(event.target.value);
  };

  return (
    <div>
      <input
        type="text"
        id="userInput"
        name="userInput"
        onChange={handleInputChange}
        className="textbox"
      />
    </div>
  );
}

function showCustomButton(label, { requestBackend, buttonClicked, setIsLoading, isLoading, setUserPrompt }) {
  const handleButtonClick = () => {
    console.log(label + ' button clicked!');
    setIsLoading(true);
    setUserPrompt(dictionary[label]);
    requestBackend();
  };
  return (
    <div>
      <button
        onClick={handleButtonClick}
        disabled={buttonClicked || isLoading}
        className="button"
      >
        {isLoading ? <span className="spinner"></span> : label}
      </button>
    </div>
  );
}
export default App;
