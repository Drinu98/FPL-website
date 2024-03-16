// "use client";
// import { useRouter } from "next/navigation";
// import React, { useState, useEffect } from "react";

// const Search = () => {
//   const [text, setText] = useState("");
//   const router = useRouter();

//   // // useEffect( () => {
//   // //     router.push(`?search=${text}`)
//   // // }, [text, router])

//   const onSearch = (e: React.FormEvent) => {
//     e.preventDefault();

//     const encodedSearchQuery = encodeURI(text);

//     router.push(`?id=${encodedSearchQuery}`);
//   };

//   return (
//     <form onSubmit={onSearch}>
//       <div>
//       <input
//   type="text"
//   placeholder="Enter ID"
//   value={text}
//   onChange={(e) => {
//     const input = e.target.value;
//     if (/^\d*$/.test(input)) {
//       setText(input);
//     }
//   }}
//   className="search"
//   pattern="\d*"
// />
//         <button className="searchButton" type="submit">
//           Go
//         </button>
//       </div>
//     </form>
//   );
// };
// export default Search;

import { useRouter } from "next/navigation";
import React, { useState, useEffect } from "react";

const Search = () => {
  const [text, setText] = useState("");
  const [errorMessage, setErrorMessage] = useState("");
  const router = useRouter();

  // useEffect to retrieve stored ID from localStorage and update router
  useEffect(() => {
    const storedId = localStorage.getItem("id");
    if (storedId) {
      setText(storedId);
      router.push(`?id=${encodeURI(storedId)}`);
    }
  }, []);

  const onSearch = (e: React.FormEvent) => {
    e.preventDefault();

    // Trim whitespace from input
    const input = text.trim();

    if (input === "") {
      // Show error message if input is empty
      setErrorMessage("Please enter an ID.");
    } else {
      // Clear error message
      setErrorMessage("");
      // Proceed with search
      const encodedSearchQuery = encodeURI(input);
      // Store ID in localStorage
      localStorage.setItem("id", input);
      // Navigate to search route
      router.push(`?id=${encodedSearchQuery}`);
    }
  };

  const onReset = () => {
    // Clear local storage
    localStorage.removeItem("id");
    // Clear text and reset router
    setText("");
    router.push("/");
  };

  return (
    <form onSubmit={onSearch}>
      <div>
        <input
          type="text"
          placeholder="Enter ID"
          value={text}
          onChange={(e) => {
            const input = e.target as HTMLInputElement; // Type assertion
            if (/^\d*$/.test(input.value)) {
              setText(input.value);
            }
          }}
          className="search"
          pattern="\d*"
          required // This makes the input required
          onInvalid={(e) => {
            const input = e.target as HTMLInputElement; // Type assertion
            input.setCustomValidity("Please enter a valid ID."); // Custom error message
          }}
          onInput={(e) => {
            const input = e.target as HTMLInputElement; // Type assertion
            input.setCustomValidity(""); // Clear custom error message on input change
          }}
        />
        <button className="searchButton" type="submit">
          Go
        </button>
        <button className="resetButton" type="button" onClick={onReset}>
          Reset
        </button>
      </div>
      {/* {errorMessage && <p className="errorMessage">{errorMessage}</p>} */}
    </form>
  );
};

export default Search;
