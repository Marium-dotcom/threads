import { SignIn } from "@clerk/nextjs";
 
export default function Page() {
  return  <main className=" bg-black h-screen flex justify-center items-center"><SignIn /></main>;
}