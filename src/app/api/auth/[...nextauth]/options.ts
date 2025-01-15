import UserModel, { Message } from './../../../../model/User';
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import getConnection from "@/lib/dbConnect";
import bcrypt from "bcryptjs";

export const authOptions: NextAuthOptions = {

  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Enter Your Email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials: any): Promise<any> {
        await getConnection()
        try {
        const user = await UserModel.findOne({
          $or : [
            { username: credentials.identifier },
            { email: credentials.identifier },
          ]

          
        })
        if (!user) {
          throw new Error("No user found with this email or username");
        }
        if(!user.isVerified) {
          throw new Error("Your account is not verified. Please verify your email")
        }
      const isPasswordCorrect =   await bcrypt.compare(credentials.password,user.password)
         if(isPasswordCorrect) {
          return user;
         }
         else {
          throw new Error("Invalid password")
         }
        }
        catch (error) {
        throw  new Error("Credentials provider error: " + error)
        }
        // Your logic for authentication here
        // const { username, password } = credentials;

        // // Example logic: Fetch user from DB, compare password
        // const db = await getConnection();
        // const user = await db.collection("users").findOne({ email: username });

        // if (user && bcrypt.compareSync(password, user.password)) {
        //   return user;
        // } else {
        //   return null;
        // }
      },
    }),
  ],
  pages : 
{
  signIn: '/sign_in',
 
},
session: {
  strategy: "jwt",
  
},
secret : process.env.NEXTAUTH_SECRET,
callbacks: {
  async jwt({ token, user }) {
    if (user) {
      console.log("User",user);
      token._id = user._id?.toString();
      token.isVerified = user.isVerified;
      token.isAcceptingMessage = user.isAcceptingMessage;
      token.username = user.username;
    }
    return token
  },
  async session({ session, token }) {
    if (token) {
      session.user = {
        _id: token._id as string,
        isVerified: token.isVerified as boolean,
        isAcceptingMessage: token.isAcceptingMessage as boolean,
        username: token.username as string,
      };
      

    }
    return session;
    
  },
  }
};
