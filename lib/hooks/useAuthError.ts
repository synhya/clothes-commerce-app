'use client';


import { useEffect } from 'react';

export default function useAuthError() {
  // * Supabase Auth Error Message Translation
  useEffect(() => {
    const observer = new MutationObserver((mutations) => {
      mutations.forEach((mutation) => {
        if (mutation.type !== "childList" || mutation.addedNodes.length === 0)
          return;

        // @ts-ignore
        for (const node of mutation.addedNodes) {
          if (
            node instanceof HTMLElement &&
            (node.classList.contains("supabase-account-ui_ui-message") ||
              node.classList.contains("supabase-auth-ui_ui-message"))
          ) {
            const originErrorMessage = node.innerHTML.trim();

            let translatedErrorMessage = "<DEFAULT MESSAGE>";
            switch (originErrorMessage) {
              case "To signup, please provide your email":
                translatedErrorMessage = "";
                break;
              case "Signup requires a valid password":
                translatedErrorMessage = "";
                break;
              case "User already registered":
                translatedErrorMessage = "";
                break;
              case "Only an email address or phone number should be provided on signup.":
                translatedErrorMessage = "";
                break;
              case "Signups not allowed for this instance":
                translatedErrorMessage = "";
                break;
              case "Email signups are disabled":
                translatedErrorMessage = "";
                break;
              case "Email link is invalid or has expired":
                translatedErrorMessage = "";
                break;
              case "Token has expired or is invalid":
                translatedErrorMessage = "";
                break;
              case "The new email address provided is invalid":
                translatedErrorMessage = "";
                break;
              case "Password should be at least 6 characters":
                translatedErrorMessage = "";
                break;
              case "Invalid login credentials":
                translatedErrorMessage = "";
                break;
            }

            if (!document.querySelector("#auth-forgot-password")) {
              node.innerHTML = translatedErrorMessage;
            }
          }
        }
      });
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });
  }, []);
}
