import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import firebase from "firebase/app";
import "firebase/storage";

export default function NuevoAlquiler() {
  const [images, setImages] = useState([]);
  const { register, handleSubmit, errors } = useForm();
  const onSubmit = async (data) => {
    if (!data.title) console.log("apaaaa");
    console.log("POST DATA: ", JSON.stringify(data));
    console.table("Table Data", data);

    try {
      const res = await fetch("/api/alquiler", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      // console.log("res", res);

      if (res.status === 200) {
        console.log("Geniaaal!", res);
      } else {
        console.log("Error!", res);
      }
    } catch (err) {
      alert(err);
    }
  };

  // useEffect(() => {
  //   register({ name: "title", type: "custom" }, { validate: { tieneValor } });
  // });

  // React.useEffect(() => {
  //   setValue("images", images);
  // }, [setValue, images]);

  const randomImageName = (image) => {
    const imageFormat = image.type.split("/")[1];
    const date = Date.now();
    const RandomSixNumbers = Math.floor(100000 + Math.random() * 900000);
    const imageName = `${date}-${RandomSixNumbers}.${imageFormat}`;

    return imageName;
  };

  const onImageChange = (e) => {
    for (let i = 0; i < e.target.files.length; i++) {
      const newImage = e.target.files[i];
      newImage["url"] = URL.createObjectURL(newImage);
      newImage["newRandomName"] = randomImageName(newImage);
      setImages((prevState) => [...prevState, newImage]);
    }
  };

  const removeImage = (url) => {
    console.log("url", url);
    const newImages = images.filter((image) => image.url != url);
    setImages(newImages);
  };

  const onUploadSubmission = (e) => {
    e.preventDefault(); // prevent page refreshing
    const promises = [];

    console.log("images", images);

    images.forEach((image) => {
      const uploadTask = firebase
        .storage()
        .ref()
        .child(`images/${image.newRandomName}`)
        .put(image);
      promises.push(uploadTask);
      uploadTask.on(
        firebase.storage.TaskEvent.STATE_CHANGED,
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          if (snapshot.state === firebase.storage.TaskState.RUNNING) {
            console.log(`Progreso: ${progress}%`);
          }
        },
        (error) => console.log(error.code),
        async () => {
          const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();
          console.log(downloadURL);
        }
      );
    });
    Promise.all(promises)
      .then(() => alert("Todas las imágenes se han subido"))
      .catch((err) => console.log(err.code));
  };

  const insert = async (e) => {
    e.preventDefault;

    console.log("formData: ", data);

    try {
      const res = await fetch("/api/insert", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (res.status === 200) {
        console.log("Geniaaal!");
      } else {
        console.log("Error!");
      }
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="flex justify-center mb-6">
      <form className="w-full max-w-lg mb-6" onSubmit={handleSubmit(onSubmit)}>
        <div className="flex flex-wrap mb-6">
          <div className="text-2xl font-semibold">Añadir Alquiler</div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="title"
            >
              Título
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white"
              name="title"
              ref={register({ required: true })}
              type="text"
              placeholder="Casa en alquiler"
            />

            {errors.title && (
              <p className="text-red-500 text-xs italic">Complete el título</p>
            )}
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="description"
            >
              Descripción
            </label>
            <textarea
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="description"
              ref={register}
              rows="4"
              placeholder="Breve descripción"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-6">
          <div className="w-full md:w-1/2 px-3">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="village"
            >
              Barrio
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 mb-3 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="location.village"
              ref={register}
              type="text"
              placeholder="Localidad"
            />
            {/* <p className="text-gray-600 text-xs italic">Make it as long and as crazy as you'd like</p> */}
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="city"
            >
              Localidad
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="location.city"
              ref={register}
              type="text"
              placeholder="Albuquerque"
            />
          </div>
        </div>
        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="province"
            >
              Provincia
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="location.province"
                ref={register}
              >
                <option>Córdoba</option>
                <option>Buenos Aires</option>
                <option>San Luis</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/2 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="zipCode"
            >
              Código Postal
            </label>
            <input
              className="appearance-none block w-full bg-gray-200 text-gray-700 border border-gray-200 rounded py-3 px-4 leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="location.zipCode"
              type="text"
              placeholder="90210"
            />
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="bedrooms"
            >
              Habitaciones
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="features.bedrooms"
                ref={register}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="bathrooms"
            >
              Baños
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="features.bathrooms"
                ref={register}
              >
                <option>1</option>
                <option>2</option>
                <option>3</option>
                <option>4</option>
                <option>5</option>
                <option>6</option>
                <option>7</option>
                <option>8</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="garage"
            >
              Garage
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="features.garage"
              ref={register}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap -mx-3 mb-2">
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="exterior"
            >
              Exterior
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="features.exterior"
                ref={register}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="petsallowed"
            >
              Mascotas
            </label>
            <div className="relative">
              <select
                className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
                name="features.petsallowed"
                ref={register}
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
                <svg
                  className="fill-current h-4 w-4"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 20 20"
                >
                  <path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z" />
                </svg>
              </div>
            </div>
          </div>
          <div className="w-full md:w-1/3 px-3 mb-6 md:mb-0">
            <label
              className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
              htmlFor="childrenallowed"
            >
              Chicos
            </label>
            <select
              className="block appearance-none w-full bg-gray-200 border border-gray-200 text-gray-700 py-3 px-4 pr-8 rounded leading-tight focus:outline-none focus:bg-white focus:border-gray-500"
              name="features.childrenallowed"
              ref={register}
            >
              <option value="true">Sí</option>
              <option value="false">No</option>
            </select>
          </div>
        </div>

        <div className="w-full mb-6 md:mb-4">
          <label
            className="block uppercase tracking-wide text-gray-700 text-xs font-bold mb-2"
            htmlFor="images"
          >
            Imágenes
          </label>
          <div className="relative">
            <label
              htmlFor="imgButton"
              className="cursor-pointer bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded"
            >
              Seleccionar imagenes
            </label>
            <input
              id="imgButton"
              type="file"
              multiple={true}
              name="images"
              ref={register}
              onChange={onImageChange}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="flex w-full p-4">
            {images.map(({ url }) => {
              return (
                <div
                  className="w-40 h-40 bg-center relative"
                  style={{
                    backgroundImage: `url(${url})`,
                    backgroundSize: "contain",
                    backgroundRepeat: "no-repeat",
                  }}
                  key={url}
                >
                  <button
                    className="absolute top-0 right-0 mr-2 
                    rounded-full bg-red-600 h-6 w-6 flex items-center justify-center"
                    onClick={() => removeImage(url)}
                  >
                    X
                  </button>
                </div>
              );
            })}
          </div>
          <button onClick={onUploadSubmission}>Subir a Firestore</button>
        </div>

        <div className="w-full mb-6 md:mb-4">
          <label>
            <input type="checkbox" name="cb-accept" /> Acepto los términos y
            condiciones.
          </label>
        </div>

        <div className="flex justify-center mt-6 mb-6">
          <div className="lg:block md:ml-6">
            <button
              type="submit"
              className="p-1 px-4 mx-4 hover:bg-green-500 text-white-700 font-semibold hover:text-white border border-green-500 hover:border-transparent rounded"
            >
              Agregar
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
