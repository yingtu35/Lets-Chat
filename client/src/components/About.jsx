import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";

const features = [
  {
    title: "Interaction",
    description: [
      "Get lightning-fast messages in real-time as your friends chat.",
      "Know who's joining or leaving the chat room, instantly!",
    ],
  },
  {
    title: "Experience",
    description: [
      "Create, discover, and join lively chat rooms with just a click!",
      "Check out the list of users; See who's with you!",
      "Enjoy a user-friendly interface for effortless chatting."
    ],
  },
  {
    title: "Security",
    description: [
      "Rest easy with our top-notch authentication system.",
      "One-click access with your Google account for added security and convenience.",
    ],
  },
];

// TODO: use React Spring for animation
const FeatureCard = ({ feature }) => {
  return (
    <Card sx={{ minWidth: 200, backgroundColor: "ghostwhite" }}>
      <CardContent>
        <Typography variant="h4" component="h2" gutterBottom align="left">
          {feature.title}
        </Typography>
        <ul style={{ listStyleType: "none" }}>
          {feature.description.map((line) => (
            <Typography component="li" variant="h6" align="left" key={line}>
              {line}
            </Typography>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

const About = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 4, textAlign: "center" }}>
      <Container maxWidth="md">
        <Typography
          sx={{ fontSize: "128px" }}
          variant="h2"
          component="h1"
          gutterBottom
        >
          Let's Chat
        </Typography>
        <Typography variant="h5" component="h2" gutterBottom>
        A web application for you and your friend to chat anywhere at any time!
        </Typography>
        <Grid sx={{ mt: "auto" }} container spacing={4} justify="center">
          {features.map((feature, idx) => (
            <Grid key={idx} item xs={12} sm={12}>
              <FeatureCard feature={feature} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default About;
