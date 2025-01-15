import * as React from "react";
import {
  Html,
  Head,
  Body,
  Container,
  Button,
  Text,
  Section,
  Row,
} from "@react-email/components";

export function EmailTemplate({ username, otp }: { username: string; otp: string }) {
  return (
    <Html lang="en">
      <Head>
        <style>
          {`
            body {
              font-family: Arial, sans-serif;
              margin: 0;
              padding: 0;
            }
          `}
        </style>
      </Head>
      <Body>
        <Container style={styles.container}>
          <Row>
            <Text style={styles.headerText}>Hello, {username}!</Text>
          </Row>
          <Text style={styles.messageText}>Your OTP code is: {otp}</Text>
          <Section>
            <Text>Thank you for being with us!</Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const styles = {
  container: {
    width: "100%",
    maxWidth: "600px",
    margin: "auto",
    backgroundColor: "#f8f9fa",
    padding: "20px",
    borderRadius: "8px",
  },
  header: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "20px",
    textAlign: "center",
    borderRadius: "8px 8px 0 0",
  },
  headerText: {
    fontSize: "24px",
    fontWeight: "bold",
  },
  content: {
    padding: "20px",
  },
  messageText: {
    fontSize: "16px",
    lineHeight: "1.5",
  },
  button: {
    backgroundColor: "#007bff",
    color: "#ffffff",
    padding: "12px 20px",
    textDecoration: "none",
    borderRadius: "5px",
    fontSize: "16px",
    fontWeight: "bold",
    display: "inline-block",
    margin: "20px 0",
  },
  buttonHover: {
    backgroundColor: "#0056b3",
  },
  footer: {
    textAlign: "center",
    padding: "10px",
    fontSize: "12px",
    color: "#6c757d",
  },
};

export default EmailTemplate;
