import "../styles/ArtistCard.css";

function ArtistCard({ name, image }) {
  return (
    <div className="artist-card">
      <img
        src={image}
        alt={name}
      />

      <h3>{name}</h3>

      <p>Artist</p>
    </div>
  );
}

export default ArtistCard;