export function showCoastalButton({ requestBackend, buttonClicked, setIsLoading, isLoading, setUserPrompt }) {
    const handleButtonClick = () => {
      setIsLoading(true);
      setUserPrompt('Coastal');
      requestBackend();
    };
    return (
      <div>
        <button
          onClick={handleButtonClick}
          disabled={buttonClicked || isLoading}
          className="button"
        >
          {isLoading ? <span className="spinner"></span> : 'Coastal'}
        </button>
      </div>
    );
  }
  export default showCoastalButton;