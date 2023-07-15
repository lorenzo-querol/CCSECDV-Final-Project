"use client";

import Head from "next/head";
import Navbar from "../components/navbar";
import SectionTitle from "../components/sectionTitle";
import Footer from "../components/footer";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { useForm } from "react-hook-form";
import sanitizeHtml from "sanitize-html";
import styles from "@/app/Form.module.css";


export default function Admin({isLoggedIn }) {
  const router = useRouter();
    return (
      <>
        <Head>
          <title>CSSECDEV GRP 2</title>
          <meta
            name="description"
            content=""
          />

        </Head>
  
        <Navbar />

        <SectionTitle
        pretitle="Admin Dashboard"
        title="Welcome back to MyApp!">
        This is the Admin Dashboard. Lorem ipsum dolor sit amet. Non reprehenderit itaque rem commodi galisum qui tempore quaerat aut illum natus ut modi consequatur. Ea consequatur dolor et impedit harum qui eaque enim? Et ratione galisum quo harum recusandae ut ipsum dolorem eum nemo earum.
        </SectionTitle>
    
      <Footer />
      </>
    );
  }

  
  
  
  
  
