import {useState} from "react";
import axios from "axios";
import './App.css';
const { Configuration, OpenAIApi } = require("openai");

const configuration = new Configuration({
  apiKey: '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',
});
const openai = new OpenAIApi(configuration);

function App() {
  const [backendResponse, setBackendResponse] = useState(null);

  const requestBackend(userPrompt: string) = async () => {
    console.log('Button clicked!');
    const url = `http://localhost:8000`;
    let response = null;
    try {
      console.log('Sending request to api...');
      const response = await openai.createImage({
        prompt: userPrompt,
        n: 2,
        size: "256x256",
      });
      setBackendResponse(response.data.data[0].url);
    } catch (error) {
      console.error(error);
    }
  }
  return (
    <div className="App">
      <header className="App-header">
        {showPromptTextbox()}
        <button onClick={requestBackend()}>Send Request To Backend</button>
        <div>
            {backendResponse && 
              <img 
                src={backendResponse} 
                style={{ maxWidth: '50%', height: 'auto' }}
              />
            }
        </div>
      </header>
    </div>
  );
}

function showPromptTextbox() {
  return (
    <div>
      <input type="text" id="userInput" name="userInput" />
    </div>
  );
}



export default App;
