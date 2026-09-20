function ArtistBox({ image, name, totalSongs }) {
  return (
    <div className="artist-box">
      <img src={image} alt={name} />

      <h3>{name}</h3>

      <p>{totalSongs} Songs</p>
    </div>
  );
}

export default ArtistBox;