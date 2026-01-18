"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import styles from "./register.module.css";

function validarEmail(email: string) {
    const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return regex.test(email);
}

export default function RegisterPage() {
    const router = useRouter();

    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();

        const res = await fetch("/api/auth/register", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();

        if (!validarEmail(email)) { 
            setError(data.error || "Insira um email válido");
            return;
        }

        if (!res.ok) {
            setError(data.error || "Erro ao registar");
            return;
        }

        await signIn("credentials", {
            redirect: false,
            email,
            password,
            callbackUrl: "/dashboard",
        });

        router.push("dashboard")
    };

    return (
        <div className={styles.registerContainer}>
            <form onSubmit={handleRegister} className={styles.registerCard}>
                <h2 className={styles.title}>Criar Conta</h2>
                <input
                className={styles.input}
                    type="text"
                    placeholder="Nome"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                />
                <input
                    className={styles.input}
                    type="text"
                    placeholder="Senha"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                />

                {error && <p className={styles.error}>{error}</p>}
                <button className={styles.button} type="submit">Cadastrar</button>
                <Link className={styles.link} href="/login">Fazer Login</Link>
            </form>
        </div>
    )
}
