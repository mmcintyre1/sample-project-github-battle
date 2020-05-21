import React from "react";
import PropTypes from "prop-types";
import { battle } from "../utils/api";
import Card from "./Card";
import Loading from "./Loading";
import Tooltip from "./Tooltip";
import {
  FaCompass,
  FaBriefcase,
  FaUsers,
  FaCode,
  FaUserFriends,
  FaUser,
} from "react-icons/fa";
import { ThemeConsumer } from "../contexts/theme";

function ProfileList({ profile }) {
  return (
    <ul className="card-list">
      <li>
        <FaUser color="rgb(239, 115, 115)" size={22} />
        {profile.name}
      </li>
      {profile.location && (
        <li>
          <Tooltip text="User's Location">
            <FaCompass color="rgb(144, 115, 255)" size={22} />
            {profile.location}
          </Tooltip>
        </li>
      )}
      {profile.company && (
        <li>
          <Tooltip text="User's Company">
            <FaBriefcase color="#795548" size={22} />
            {profile.company}
          </Tooltip>
        </li>
      )}
      <li>
        <FaUsers color="rgb(129, 195, 245)" size={22} />
        {profile.followers.toLocaleString()} followers
      </li>
      <li>
        <FaUserFriends color="rgb(64, 183, 95)" size={22} />
        {profile.following.toLocaleString()} following
      </li>
      <li>
        <FaCode color="rgb(157, 165, 179)" size={22} />
        {profile.public_repos.toLocaleString()} repositories
      </li>
    </ul>
  );
}

ProfileList.propTypes = {
  profile: PropTypes.object.isRequired,
};

export default class Results extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      winner: null,
      loser: null,
      error: null,
      loading: true,
    };
  }

  componentDidMount() {
    const { playerOne, playerTwo } = this.props;
    battle([playerOne, playerTwo])
      .then((players) => {
        this.setState({
          winner: players[0],
          loser: players[1],
          error: null,
          loading: false,
        });
      })
      .catch(({ message }) => {
        this.setState({
          error: message,
          loading: false,
        });
      });
  }

  render() {
    const { winner, loser, error, loading } = this.state;

    if (loading === true) {
      return <Loading />;
    }

    if (error) {
      <p className="center-text error">{error}</p>;
    }
    return (
      <ThemeConsumer>
        {({ theme }) => (
          <React.Fragment>
            <div className="grid space-around container-sm">
              <Card
                header={winner.score === loser.score ? "Tie" : "Winner"}
                subheader={`Score: ${winner.score.toLocaleString()}`}
                avatar={winner.profile.avatar_url}
                href={winner.profile.html_url}
                name={winner.profile.login}
              >
                <ProfileList profile={winner.profile} />
              </Card>
              <Card
                header={winner.score === loser.score ? "Tie" : "Loser"}
                subheader={`Score: ${loser.score.toLocaleString()}`}
                avatar={loser.profile.avatar_url}
                href={loser.profile.html_url}
                name={loser.profile.login}
              >
                <ProfileList profile={loser.profile} />
              </Card>
            </div>
            <button
              onClick={this.props.onReset}
              className={`btn ${
                theme === "light" ? "dark-btn" : "light-btn"
              } btn-space animated-border-button`}
            >
              Reset
            </button>
          </React.Fragment>
        )}
      </ThemeConsumer>
    );
  }
}

Results.propTypes = {
  playerOne: PropTypes.string.isRequired,
  playerTwo: PropTypes.string.isRequired,
  onReset: PropTypes.func.isRequired,
};
