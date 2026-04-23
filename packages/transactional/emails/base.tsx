import { Html, Body, Container, Tailwind, Head, Section, Text, Img, Preview } from '@react-email/components'
import * as React from 'react'
interface BaseProps {
    // preview?: string | string[]
    children: React.ReactNode
}

export const Base: React.FC<BaseProps> = ({ children }) => {
    return (
        <Html className=''>
            <Head />
            {/* <Preview>
                {preview} 
            </Preview> */}
            <Tailwind>
                <Body className="bg-white my-auto mx-auto font-sans px-2 text-sm">
                    <Container className="border border-solid border-[#eaeaea] rounded my-[40px] mx-auto p-[20px] max-w-[465px] w-full overflow-hidden">
                        {/* Header */}
                        <Section className="bg-gray-50 text-white text-center px-6 py-4 border-b-4  border-solid  border-blue-500 ">
                            <Img
                                src="https://i.postimg.cc/yNYKqSvS/Coderina-Logo-FULL-Transparent-1-removebg-preview.png"
                                alt="Coderina Logo"
                                className="w-24 mx-auto"
                            />

                        </Section>
                        <div className="max-w-full break-words">
                            {children}
                        </div>
                         <Text className="text-sm">
                                    <br />
                                    Best regards,
                                    <br />
                                    The Coderina Team
                                    <br />
                                    <a className='font-bold text-blue-500 no-underline' href="https://coderina.org">
                                        www.coderina.org
                                    </a>
                                  </Text>
                        <Section className="bg-blue-500 p-6 mt-10 ">
                            <Text className="text-center text-white text-sm">
                                If you have any questions, reply to this email or contact our support team at hello@coderina.org or call +234 909 330 7353
                            </Text>
                            <Text className="text-center text-gray-200 text-xs mt-4">
                                © {new Date().getFullYear()} Coderina Inc. All rights reserved.
                            </Text>
                        </Section>
                    </Container>
                </Body>
            </Tailwind>
        </Html>
    )
}