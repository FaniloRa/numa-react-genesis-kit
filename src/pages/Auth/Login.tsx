
import React from "react";
import { Navigate, useNavigate, Link } from "react-router-dom";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useAuth } from "@/lib/auth";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { UserRole } from "@/types";

const formSchema = z.object({
  email: z.string().email("Veuillez entrer un email valide"),
  password: z.string().min(6, "Le mot de passe doit contenir au moins 6 caractères"),
});

type FormData = z.infer<typeof formSchema>;

const Login: React.FC = () => {
  const { auth, signIn } = useAuth();
  const navigate = useNavigate();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { isSubmitting } = form.formState;

  const onSubmit = async (data: FormData) => {
    const { error } = await signIn(data.email, data.password);
    if (!error) {
      navigate("/dashboard"); // Default route after login
    }
  };

  // Redirect if already logged in
  if (auth.user && !auth.isLoading) {
    // Redirect based on user role
    if (auth.user.role === UserRole.ADMIN) {
      return <Navigate to="/dashboard" />;
    } else if (auth.user.role === UserRole.AGENT) {
      return <Navigate to="/dashboard" />;
    } else {
      return <Navigate to="/dashboard" />;
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-soft-purple to-soft-blue p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold text-vivid-purple">i-numa</CardTitle>
          <CardDescription>Connectez-vous à votre compte</CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input placeholder="exemple@email.com" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mot de passe</FormLabel>
                    <FormControl>
                      <Input type="password" placeholder="••••••" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting ? "Connexion en cours..." : "Se connecter"}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex-col space-y-2">
          <div className="text-center text-sm">
            <span className="text-muted-foreground">
              Vous n'avez pas de compte ?{" "}
            </span>
            <Link to="/register" className="text-vivid-purple hover:underline">
              Inscrivez-vous
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default Login;
