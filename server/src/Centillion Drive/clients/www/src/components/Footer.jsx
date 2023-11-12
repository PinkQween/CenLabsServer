import React from "react";
import {
	Box,
	FooterContainer,
	Row,
	Column,
	FooterLink,
	Heading,
} from "../styles/FooterStyles";

const Footer = () => {
	return (
		<Box>
			<h1 className="text-4xl text-center m-4 mb-8 uppercase">
				A invisible hard drive!
			</h1>
			<FooterContainer>
				<Row>
					<Column>
						<Heading>About Us</Heading>
						<FooterLink to="/aim">
							Aim
						</FooterLink>
						<FooterLink to="/vision">
							Vision
						</FooterLink>
						<FooterLink to="/contact-us">
                            Contact Us
						</FooterLink>
					</Column>
					<Column>
						<Heading>Services</Heading>
						<FooterLink to="/">
							Centillion Drive
						</FooterLink>
						<FooterLink to="https://auth.cendrive.com/">
							Centillion Authentication
						</FooterLink>
						<FooterLink to="https://search.cendrive.com/">
							Centillion Search
						</FooterLink>
						<FooterLink to="/blogs">
							Centillion Blogs
						</FooterLink>
					</Column>
					<Column>
						<Heading>Social Media</Heading>
						<FooterLink to="/">
							<i className="fab fa-facebook-f">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Facebook
								</span>
							</i>
						</FooterLink>
						<FooterLink to="/">
							<i className="fab fa-instagram">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Instagram
								</span>
							</i>
						</FooterLink>
						<FooterLink to="/">
							<i className="fab fa-twitter">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Twitter
								</span>
							</i>
						</FooterLink>
						<FooterLink to="/">
							<i className="fab fa-youtube">
								<span
									style={{
										marginLeft: "10px",
									}}
								>
									Youtube
								</span>
							</i>
						</FooterLink>
					</Column>
					<Column>
                        <Heading>Other</Heading>
					</Column>
				</Row>
			</FooterContainer>
		</Box>
	);
};
export default Footer;
