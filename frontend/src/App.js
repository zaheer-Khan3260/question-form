import './App.css';
import FormEditor from './components/FormEditor.jsx';
import Categorize from './components/QuestionsType/Categorize.jsx';

function App() {
  const handleUpdate = (data) => {
    console.log(data)
  }
  return (
    <div className="p-10 w-full bg-primary-background h-full">
      <div className='w-1/2 mx-auto p-3'>
      <FormEditor/>
    </div>
    </div>
  );
}

export default App;
