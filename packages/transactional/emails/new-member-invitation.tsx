import { Base } from "./base"

interface EmailTemplateProps {
  data: {
    url: string,
    teamName?: string
  }
}

export const NewMemberInviteEmailTemplate: React.FC<Readonly<EmailTemplateProps>> = ({ data }) => {
  return (
    <Base>
      <div>
        <h1 className="font-sans text-lg">You are invited to join {data.teamName ? `${data.teamName} on ` : ''}  on Coderina!</h1>
        <p className="font-sans text-sm text-gray-500">
          To join the team, please accept the invitation.<br />
        </p>
        <div className="mb-4">
           <a  href={`${data.url}`}
          className="bg-blue-500 text-white py-2 px-4 no-underline rounded font-bold rounded-lg mt-4 mb-8 inline-block"
          >
            Accept Invitation
          </a>
          <div style={{ fontSize: 13, color: '#555', marginTop: 8 }}>
            If you can’t click the button, here’s your link: <br />
            <span style={{ color: '#0070f3' }}>{`${data.url}`}</span>
          </div>
        </div>
        <div style={{ fontSize: 13, color: '#888', marginBottom: 24 }}>
          You received this email because you were invited to join your team.<br />
          If you have any questions, please contact our support team.
        </div>
     
      </div>
    </Base>
  )
}

const MockData: EmailTemplateProps = {
  data: {
    url: "https://string.com",
    teamName: "John's Team"
  }
}
export default () => <NewMemberInviteEmailTemplate {...MockData} />