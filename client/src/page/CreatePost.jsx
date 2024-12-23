import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FormField,Loader } from '../components';
import { preview } from '../assets';
import { getRandomPrompt } from '../utils';

const CreatePost = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: '',
    prompt: '',
    photo: '',
  });
  const [generatingImg, setGeneratingImg] = useState(false);
  const [loading, setLoading] = useState(false);



  // handle functions
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.prompt && form.photo) {
      setLoading(true);
      try {
        const response = await fetch('https://imagegeneration-r9ix.onrender.com/api/v1/post', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(form),
        });
        alert('Success');
        navigate('/');
      } catch (err) {
        alert(err);
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please generate an image with proper details');
    }
  };


  const handleChange = (e) => {
    setForm({...form, [e.target.name]:e.target.value})
  };


  const handleSurpriseMe = () => {
    const randomPrompt = getRandomPrompt(form.prompt)
    setForm({...form,prompt:randomPrompt})
  };


  // generate functions
  const generateImg = async () => {
    if(form.prompt){
    try {
      setGeneratingImg(true)
      const response = await fetch('https://imagegeneration-r9ix.onrender.com/api/v1/dalle',{
        method : 'POST',
        headers :{
          'Content-Type':'application/json',
        },
        body : JSON.stringify({prompt:form.prompt})
      })

      if(response.ok){

        const blob = await response.blob(); 

        const base64String = await blobToBase64(blob);

        const base64Image = `data:image/jpeg;base64,${base64String}`;

        setForm({ ...form, photo: base64Image });

      }
     
      else{
        console.log("Failed to generate may be token limit exceeded");
        alert("Failed to generate may be token limit exceeded")
        
      }
     
    } catch (error) {
      console.log(error);
      alert(error)

    } finally{
      setGeneratingImg(false)
    }
  }
    else{
      alert("Please enter a prompt")
    }
  };



  const blobToBase64 = (blob) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(blob); 
    });
  };

  return (
    <section className='mx-auto max-w-7xl flex items-center justify-center'>
      <div className='w-full max-w-3xl m-auto'>
        <div>
          <h1 className='font-extrabold text-[#222328] text-[30px]'>Create a new Image</h1>
          <p className='mt-2 max-w-[500px] text-[#666e75] text-[16px]'>
            Create imagination and visually stunning images through Dream Studio AI
          </p>
        </div>
        <form className='mt-16 max-w-3xl' onSubmit={handleSubmit}>
          <div className='flex flex-col gap-5'>
            <FormField
              labelName='Your Name'
              type='text'
              name='name'
              placeholder='Enter name'
              value={form.name}
              handleChange={handleChange}
            />
            <FormField
              labelName='Prompt'
              type='text'
              name='prompt'
              placeholder='an armchair in the shape of an avocado'
              value={form.prompt}
              handleChange={handleChange}
              isSurpriseMe
              handleSurpriseMe={handleSurpriseMe}
            />
            <div className='relative bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 w-64 p-3 h-64 flex justify-center items-center'>
              {form.photo ? (
                <img src={form.photo} alt={form.prompt} className='w-full h-full object-contain' />
              ) : (
                <img
                  src={preview}
                  alt='preview'
                  className='w-9/12 h-9/12 object-contain opacity-40'
                />
              )}
              {generatingImg && (
                <div className='absolute inset-0 z-0 flex justify-center items-center bg-[rgbs(0,0,0,0.5)] rounded-lg'>
                  <Loader />
                </div>
              )}
            </div>
          </div>
          <div className='mt-5 flex gap-5'>
            <button
              type='button'
              onClick={generateImg}
              className='text-white bg-green-700 font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            >
              {generatingImg ? 'Generating...' : 'Generate'}
            </button>
          </div>

          <div className='mt-10'>
            <p className='mt-2 text-[#666e75] text-[14px]'>
              Once you have created the image you want, you can share it with others in the community
            </p>
            <button
              type="submit"
              className='mt-3 text-white bg-[#6469ff] font-medium rounded-md text-sm w-full sm:w-auto px-5 py-2.5 text-center'
            >
              {loading ? 'Sharing...' : 'Share with the community'}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default CreatePost;
