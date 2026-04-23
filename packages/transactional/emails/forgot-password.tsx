import { Base } from "./base"

interface EmailTemplateProps {
  data: {
    host: string,
    resetPasswordToken: string
  }
}

export const ForgotPasswordEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ data }) => {
  return (
    <Base>
      <div>
        <h1 className="font-sans text-lg">Have you forgotten your password?</h1>
        <p>
          We have received a request to reset the password for your account. Please click the button below to set a
          new password. Please note, the link is valid for the next 24 hours only.
        </p>
        <div>
          <a  href={`${data.host}/reset-password?resetPasswordToken=${data.resetPasswordToken}`}
          className="bg-blue-500 text-white py-2 px-4 no-underline rounded font-bold rounded-lg mt-4 mb-8 inline-block"
          >
            Reset Password
          </a>
        </div>
        <p>If you did not request this change, please ignore this email.</p>
      </div>
    </Base>

  )
}

const MockData: EmailTemplateProps = {
  data: {
    host: "https://string.com",
    resetPasswordToken: "string"
  }
}
export default () => <ForgotPasswordEmailTemplate {...MockData} />