'use client'
import { useState, useEffect } from "react"
//import { login } from "@/functions/login"
import { Button } from "./ui/button"
import Link from "next/link"
import google from "@/images/google.png"
import { Separator } from "./ui/separator"
import { login } from "../functions/login"
import Loader from "./loader"
import { useRouter } from "next/navigation"

export function LoginCard() {

    const router = useRouter()

    const [loading, setLoading] = useState(false)

    const [formData, setFormData] = useState({
        email: '',
        password: '',
    })

    const [errors, setErrors] = useState({
        email: '',
        password: '',
    })

    const [isValid, setIsValid] = useState(false)

    // Real-time validation function
    const validateForm = (name: string, value: string) => {
        const newErrors = { ...errors }

        switch (name) {
            case 'email':
                newErrors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Email is invalid.'
                break
            default:
                break
        }

        setErrors(newErrors)
    }

    // Handle field changes and validate in real-time
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setFormData(prevData => {
            const newFormData = { ...prevData, [name]: value }
            validateForm(name, value)
            return newFormData
        })
    }

    // Check validity whenever formData or errors change
    useEffect(() => {
        const allFieldsFilled = Object.values(formData).every(field => field !== '')
        const noErrors = Object.values(errors).every(error => error === '')
        setIsValid(allFieldsFilled && noErrors)
    }, [formData, errors])

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setLoading(true)
        console.log(formData)
        const loginSuccessful = await login(formData)
        console.log(loginSuccessful)
        if(loginSuccessful === true){
            setLoading(false)
            router.push('/dashboard')
        }else {
            setLoading(false)
            console.log(loginSuccessful)
        }
        setLoading(false)
        // Perform the submit logic here
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {loading && <Loader />}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800">Welcome Back !</h1>
                <p className="text-sm text-gray-600">We are please to welcome you back to our app.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4">
                <div className="flex flex-col w-full text-sm">
                    <label htmlFor="email">Email Address</label>
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="border p-2 rounded"
                        value={formData.email}
                        onChange={handleChange}
                    />
                    {errors.email && <p style={{ color: 'red' }}>{errors.email}</p>}
                </div>
                <div className="flex flex-col w-full text-sm">
                    <label htmlFor="password">Password</label>
                    <input
                        type="password"
                        name="password"
                        placeholder="Password"
                        className="border p-2 rounded"
                        value={formData.password}
                        onChange={handleChange}
                    />
                </div>
                <SubmitButton isValid={isValid} />
                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-muted-foreground">OR CONTINUE WITH</span>
                    <Separator className="flex-1" />
                </div>
                <Button variant="outline" className="font-bold w-full">
                    <img style={{width: 20}} src={google.src} />  Google
                </Button>
                <p className="text-gray-600">Don't have an account ? <Link className="underline" href="/auth/login">Sign Up</Link></p>
            </form>
        </div>
    )
}

function SubmitButton({ isValid }: { isValid: boolean }) {
    return (
        <Button className="w-full" disabled={!isValid} type="submit">
            Sign Up
        </Button>
    )
}
