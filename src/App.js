import './App.css';
import Navbar from './Components/Navbar';
import Logo from './Logo/Logo';
import ImgLinkForm from './Components/ImgLinkForm/ImgLinkForm';
import FaceRecognition from './Components/FaceRecognition/FaceRecognition';
import Rank from './Components/Rank/Rank';
import Particles from 'react-particles-js';
import React,{useState} from 'react'
import Clarifai from 'clarifai';
import Signin from './Components/Signin/Signin';
import Register from './Components/Register/Register';


const app = new Clarifai.App({
  apiKey: "10ea6eba65d4480884dee96122a17c0b"
})

const Parametters={
  particles:{
    line_lineked:{
      shadow:{
        enable: true,
        color: "#3cA9D1",
        blur:5
      }
    }
  }
}

function App() 
{  
  const  [input, setInput] = useState('');
  const  [imageUrl, setimageUrl] = useState('');
  const  [box, setBox] = useState({});
  const  [route, setRoute] = useState('signin');
  const  [isSignedIn, setIsSignedIn] = useState(false);
  const  [user, setUser] = useState({  id: '',
  name: '',
  email: '',
  entries: 0,
  joined: ''});

  
 const  loadUser = (data) => {
  setUser( {
    id: data.id,
    name: data.name,
    email: data.email,
    entries: data.entries,
    joined: data.joined
    })
  }


  const calculateFaceLocation = (data) => {
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

const displayFaceBox = (box) => {
  setBox(box);
}


const onInputChange=(e)=>{
  setInput(e.target.value)
}

const ButtononSubmit = () => {
  setimageUrl(input);
  app.models.predict("f76196b43bbd45c99b4f3cd8e8b40a8a", input)
    .then(response => {
      if (response) {
        fetch('https://sleepy-headland-92088.herokuapp.com/image', {
          method: 'put',
          headers: {'Content-Type': 'application/json'},
          body: JSON.stringify({
            id: user.id
          })
        })
          .then(response => response.json())
          .then(count => {
            console.log("user.id" , user)
            setUser({
              id: user.id,
              name: user.name,
              email: user.email,
              entries: count,
              joined: user.joined
            })
          })

      }
     displayFaceBox(calculateFaceLocation(response))
    })
    .catch(err => console.log(err));
}


const onRouteChange = (route) => {
  if (route === 'signout') {
    setIsSignedIn(false)
  } else if (route === 'home') {
    setIsSignedIn(true)
  }
  setRoute(route)
}


  return (
    <div className="App">
      <Particles className='particles' 
      params={Parametters}
      />
      <Navbar isSignedIn={isSignedIn} onRouteChange={onRouteChange} />
        {route ==='home'
      ?<div> 
      <Logo />
      <Rank 
      name={user.name}
      entries={user.entries}
      />
      <ImgLinkForm onInputChange={onInputChange} ButtononSubmit={ButtononSubmit} />
      <FaceRecognition  box={box} imageUrl={imageUrl} />
      </div> 
      :(
        route === 'signin' 
        ? <Signin    loadUser={loadUser} onRouteChange={onRouteChange}/>
        :  <Register  loadUser={loadUser}  onRouteChange={onRouteChange}/>
        )
        
}
 </div>
  );
}

export default App;
