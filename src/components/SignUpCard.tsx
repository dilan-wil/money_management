'use client'
import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "./ui/button"
import Link from "next/link"
import google from "@/images/google.png"
import { Separator } from "./ui/separator"
import { signup } from "@/functions/signup"
import Loader from "./loader"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select"

export function SignUpCard() {

    const router = useRouter();
    const [loading, setLoading] = useState(false)
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        cPassword: ''
    })

    const [errors, setErrors] = useState({
        firstName: '',
        lastName: '',
        email: '',
        password: '',
        cPassword: ''
    })

    const [isValid, setIsValid] = useState(false)

    // Real-time validation function
    const validateForm = (name: string, value: string) => {
        const newErrors = { ...errors }

        switch (name) {
            case 'firstName':
                newErrors.firstName = value ? '' : 'First name is required.'
                break
            case 'lastName':
                newErrors.lastName = value ? '' : 'Last name is required.'
                break
            case 'email':
                newErrors.email = /\S+@\S+\.\S+/.test(value) ? '' : 'Email is invalid.'
                break
            case 'password':
                const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*])[A-Za-z\d!@#$%^&*]{6,}$/
                newErrors.password = passwordRegex.test(value) ? '' : 'Password must be at least 6 characters long, contain one uppercase letter, one number, and one special character.'
                break
            case 'cPassword':
                newErrors.cPassword = value === formData.password ? '' : 'Passwords do not match.'
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

        const signUp = await signup(formData)

        if (signUp === true) {
            setLoading(false)
            router.push('/dashboard')
        } else {
            console.log(signUp)
        }
        setLoading(false)
        // Perform the submit logic here
    }

    return (
        <div className="flex flex-col items-center justify-center gap-4">
            {loading && <Loader />}
            <div className="flex flex-col items-center justify-center">
                <h1 className="text-2xl font-bold text-gray-800">Create an account !</h1>
                <p className="text-sm text-gray-600">Create an account to fully access our app.</p>
            </div>
            <form onSubmit={handleSubmit} className="flex flex-col items-center justify-center gap-4">
                <div className="flex w-full gap-2">
                    <div className="flex flex-col w-full text-sm">
                        <label htmlFor="firstName">First Name</label>
                        <input
                            type="text"
                            name="firstName"
                            placeholder="First Name"
                            className="border p-2 rounded"
                            value={formData.firstName}
                            onChange={handleChange}
                        />
                        {errors.firstName && <p style={{ color: 'red' }}>{errors.firstName}</p>}
                    </div>
                    <div className="flex flex-col w-full text-sm">
                        <label htmlFor="lastName">Last Name</label>
                        <input
                            type="text"
                            name="lastName"
                            placeholder="Last Name"
                            className="border p-2 rounded"
                            value={formData.lastName}
                            onChange={handleChange}
                        />
                        {errors.lastName && <p style={{ color: 'red' }}>{errors.lastName}</p>}
                    </div>
                </div>
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
                    <label htmlFor="email">Currency</label>
                    <Select required
                        onValueChange={(value) => {
                            console.log(value)
                            setFormData((prev) => ({
                                ...prev,
                                currency: value, // Store only the category name
                            }));
                            return
                        }}                >
                        <SelectTrigger className="col-span-3">
                            <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem key={1} value="XAF">
                                XAF
                            </SelectItem>
                            <SelectItem key={2} value="CAD">
                                CAD
                            </SelectItem>
                            <SelectItem key={3} value="USD">
                                USD
                            </SelectItem>
                            <SelectItem key={4} value="EUR">
                                EURO
                            </SelectItem>
                        </SelectContent>
                    </Select>
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
                    {errors.password && (
                        <div style={{ color: 'red' }}>
                            <p>Password must:</p>
                            <ul>
                                <li>- Be at least 6 characters</li>
                                <li>- Contain at least one uppercase letter</li>
                                <li>- Contain at least one number</li>
                                <li>- Contain at least one special character</li>
                            </ul>
                        </div>
                    )}
                </div>
                <div className="flex flex-col w-full text-sm">
                    <label htmlFor="cPassword">Confirm Password</label>
                    <input
                        type="password"
                        name="cPassword"
                        placeholder="Confirm Password"
                        className="border p-2 rounded"
                        value={formData.cPassword}
                        onChange={handleChange}
                    />
                    {errors.cPassword && <p style={{ color: 'red' }}>{errors.cPassword}</p>}
                </div>
                <SubmitButton isValid={isValid} />
                <div className="flex items-center gap-4">
                    <Separator className="flex-1" />
                    <span className="text-muted-foreground">OR CONTINUE WITH</span>
                    <Separator className="flex-1" />
                </div>
                <Button variant="outline" className="font-bold w-full">
                    <img style={{ width: 20 }} src={google.src} />  Google
                </Button>
                <p className="text-sm text-gray-600">By signing up, you agree to our <Link className="underline" href="">Terms of Services</Link> and <Link className="underline" href="">Privacy Policy</Link></p>
                <p className="text-gray-600">Already have an account ? <Link className="underline" href="/auth/login">Login</Link></p>
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
