// import { jwtDecode } from "jwt-decode";
import { signInWithEmailAndPassword, auth } from "../../config/firebase/index";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

const LoginScreen = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const navigate = useNavigate();
  const loginHandler = async ({ email, password }) => {
    try {
      console.log(email);
      console.log(password);
      const response = await signInWithEmailAndPassword(auth, email, password);
      toast.success("Successfully logged in");
      const uid = response.user.uid;
      localStorage.setItem("user", uid);
      navigate("/");
      // console.log(response.user.accessToken);
      // console.log(await response.user.getIdToken());
      // const token = await response.user.getIdToken();
      // const decoded = jwtDecode(token);
      // console.log("jwt===..>>>>>>> ", decoded.user_id);
      // console.log("jwt===..>>>>>>> ", uid);
      navigate("/");
      // localStorage.setItem("user", JSON.stringify({ token, uid }));
    } catch (error) {
      console.log(error);
      if (error.code === "auth/invalid-credential")
        toast.error("Invalid Credentials");
      else if (error.code === "auth/network-request-failed")
        toast.error("Please check your internet connection");
      else toast.error("Too many attempts! Please try again later");
    }
  };

  return (
    /* "handleSubmit" will validate your inputs before invoking "onSubmit" */

    <div className="flex justify-center items-center h-[100vh]">
      <div className="w-full max-w-[380px] p-5  shadow-sm4sided rounded">
        <h1 className="text-center text-[42px] font-[500] mb-6">Login</h1>
        <form
          onSubmit={handleSubmit(loginHandler)}
          className="flex gap-4 flex-col"
        >
          {/* register your input into the hook by invoking the "register" function */}
          <input
            className="border w-full px-2 py-3 outline-none  focus:ring-1 focus:ring-[orange] focus:border-none "
            placeholder="email..."
            {...register("email", {
              required: {
                value: true,
                message: "Required*",
              },
              pattern: {
                value: /^[A-Za-z0-9._%-+]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/,
                message: "Incorrect email pattern*",
              },
            })}
          />
          {errors.email && (
            <span className="block text-[red]  mb-4  ">
              {errors.email.message}
            </span>
          )}

          {/* include validation with required or other standard HTML validation rules */}
          <input
            className="border w-full px-2 py-3 outline-none focus:ring-1 focus:ring-[orange] focus:border-none "
            placeholder="password..."
            {...register("password", {
              required: { value: true, message: "Required*" },
            })}
          />
          {/* errors will return when field validation fails  */}
          {errors.password && (
            <span className="block text-[red]  mb-4  ">
              {errors.password.message}
            </span>
          )}

          <input
            type="submit"
            className="w-full bg-[#ffa500] py-2 rounded cursor-pointer transform transition duration-200 font-[600] hover:scale-95 "
          />
        </form>
      </div>
    </div>
  );
};

export default LoginScreen;
