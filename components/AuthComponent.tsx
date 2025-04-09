"use client"

import axios from "axios";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";


export default function AuthComponent({ authType }: { authType: string }) {
    const router = useRouter()
    const [email, setEmail] = useState<string>()
    const [password, setPassword] = useState<string>()

    const clickHandler = async () => {
        const response = await axios.post("/api/auth", {
            email,
            password,
            authType
        })
        console.log(response)
        if (response && authType === "Signup") {
            alert("Account created! Please log in.");
            router.push("/signin");
        } else if(response && authType === "Signin"){
            localStorage.setItem("token", response.data.token);
            alert("Logged in!");
            router.push("/");
        }
    }

    return (<div>
        <div className="h-screen flex justify-center">
            <div className="flex flex-col justify-center">
                <div className='min-w-sm border rounded-2xl p-4'>
                    <div className='text-2xl font-semibold'>
                        {authType == "Signin" ? "Signin" : "Signup"}
                    </div>
                    <LabelledInput type="text" placeholder="Email" label="Email" onChange={setEmail} />
                    {/* {JSON.stringify(email)} */}
                    <LabelledInput type="password" placeholder="Password" label="Password" onChange={setPassword} />
                    {/* {JSON.stringify(password)} */}
                    <Button authType={authType} onClick={clickHandler} />
                    <p className='text-center pt-2'>
                        {authType == "Signin" ?
                            <>
                            Don't Have an Account?{" "} 
                            <Link className='hover:underline text-blue-600' href="/signup" >Signup</Link>
                            </> :
                            <>
                            Already have an account?{" "}
                            <Link className='hover:underline text-blue-600' href="/signin" >Signin</Link>
                            </>}
                    </p>
                </div>
            </div>
        </div>
    </div>)
}

interface Input {
    type: string
    label: String
    placeholder: string
    onChange: (val: string) => void
}

function LabelledInput(props: Input) {
    return (
        <div className="flex flex-col">
            <label className="p-2 font-semibold">{props.label}</label>
            <input className='p-2 border rounded-md bg-gray-50' type={props.type} placeholder={props.placeholder} onChange={(e) => { props.onChange(e.target.value) }} />
        </div>
    )
}

interface Button {
    authType: string,
    onClick: () => void
}

function Button(props: Button) {
    return (
        <button onClick={props.onClick} type="button" className='w-full bg-blue-500 mt-5 p-3 border rounded-2xl font-semibold hover:bg-blue-600' >{props.authType}</button>
    )
}