import connectToDatabase from "@/utils/database";
import User from "@/models/user";
import bcrypt from "bcrypt";
import sanitizeHtml from "sanitize-html";

export async function POST(req) {
    try {
        const request = await req.json();
        await connectToDatabase();

        const { email, firstName, lastName, password, phoneNumber, confirmPassword} = request;
        let checked = false 
        if (confirmPassword != null) 
            if (password === confirmPassword)
                checked = true
            else
                checked = false
        else if (!(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*()\-_=+{};:,<.>])(?!.*\s).{12,64}$/.test(password)))
            checked = true
        if (checked) {
            delete request.confirmPassword 

            let test1 = true
            let test2 = true 
            let test3 = true 
            let test4 = true
        
            if (!(/^[\w\s\u00C0-\u017F]{2,}$/.test(firstName)))
                test1 = false
            if (!(/^[\w\s\u00C0-\u017F]{2,}$/.test(lastName)))
                test2 = false
            if (!(/^\s*09\d{9}\s*$/.test(phoneNumber)))
                test3 = false
            if (!(/^[\w.\-]+[a-zA-Z0-9]*@[a-zA-Z0-9\-]+\.[a-zA-Z]{2,}(\.[a-zA-Z]{2,})?$/.test(email)))
                test4 = false

            if (test1 && test2 && test3 && test4) {
                const hashedPassword = await bcrypt.hash(password, 10); // Hash the password with internally generated salt
                const user = new User({
                    email: sanitizeHtml(email.trim()),
                    firstName: sanitizeHtml(firstName.trim()),
                    lastName: sanitizeHtml(lastName.trim()),
                    password: hashedPassword,
                    phoneNumber: sanitizeHtml(phoneNumber.trim()),
                });
    
                await user.save();
                return new Response(
                    { message: "User created successfully" },
                    { status: 201 }
                );
            }
            else {
                return new Response(
                    { message: "Error creating user." },
                    { status: 500 }
                 );
            }
        }
        else {
            console.log(`[${new Date().toLocaleString()}]`);
            return new Response(
                { message: "Error creating user. " },
                { status: 500 }
             );
        }
    
    } catch (error) {
        console.log(`[${new Date().toLocaleString()}]`, error.message);
        return new Response(
            { message: "Error creating user." },
            { status: 500 }
        );
    }
}
