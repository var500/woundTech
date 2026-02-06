import { useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { useAuth } from "~/utils/api";
import { Select } from "../select";

export const RegisterForm = ({
  userType,
  handleSetIsRegistering,
  email,
  password,
  setEmail,
  setPassword,
}: {
  userType: string;
  email: string;
  password: string;
  handleSetIsRegistering: React.Dispatch<React.SetStateAction<boolean>>;
  setEmail: (email: string) => void;
  setPassword: (password: string) => void;
}) => {
  const [firstName, setFirstName] = useState("");
  const [dateOfBirth, setDateOfBirth] = useState("");
  const [gender, setGender] = useState("");
  const [mobile, setMobile] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [lastName, setLastName] = useState("");

  const {
    isLoading: authLoading,
    clinicianRegister,
    patientRegister,
  } = useAuth();

  const handleRegister = async (e: any) => {
    e.preventDefault();
    try {
      if (userType === "clinician") {
        await clinicianRegister({ email, password, firstName, lastName });
      } else {
        await patientRegister({ email, password, firstName, lastName });
      }

      handleSetIsRegistering(false);
    } catch (err) {
      console.error("Registration error:", err);
    }
  };
  return (
    <form onSubmit={handleRegister}>
      <Input
        label="First Name"
        value={firstName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setFirstName(e.target.value)
        }
        placeholder="First name"
        required
      />
      <Input
        label="Last Name"
        value={lastName}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setLastName(e.target.value)
        }
        placeholder="Last name"
        required
      />
      <Input
        label="Date of Birth"
        type="date"
        value={dateOfBirth}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setDateOfBirth(e.target.value)
        }
        placeholder="Enter your date of birth"
        required
      />
      <Select
        label="Gender"
        value={gender}
        onChange={(e: React.ChangeEvent<HTMLSelectElement>) =>
          setGender(e.target.value)
        }
        options={[
          { value: "male", label: "Male" },
          { value: "female", label: "Female" },
          { value: "other", label: "Other" },
        ]}
        required
      />
      <Input
        label="Mobile Number"
        type="tel"
        value={mobile}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setMobile(e.target.value)
        }
        placeholder="Enter your mobile number"
        required
      />
      <Input
        label="City"
        type="text"
        value={city}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setCity(e.target.value)
        }
        placeholder="Enter your city"
        required
      />
      <Input
        label="Address"
        type="text"
        value={address}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setAddress(e.target.value)
        }
        placeholder="Enter your address"
        required
      />
      <Input
        label="Email Address"
        type="email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
        placeholder="Enter your email"
        required
      />
      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
        placeholder="Enter your password"
        required
      />
      <Button type="submit" className="w-full mt-6" disabled={authLoading}>
        {authLoading ? "Creating Account..." : "Create Account"}
      </Button>
    </form>
  );
};
