const CreationAlert = ({ collectionImg, newCollectionCreated }: any) => {
  return (
    <div className="create-alert-wrapper">
      {!newCollectionCreated ? (
        <div className="center-container">Please, wait</div>
      ) : newCollectionCreated?.ok === true ? (
        <div className="center-container">
          <img
            src={collectionImg}
            className="collection-img center-container__image"
            style={{ marginTop: 0 }}
            alt="Collection"
          />
          <p>The collection has been created successfully</p>
        </div>
      ) : (
        <div className="center-container">
          <span>Some error happened</span>
        </div>
      )}
    </div>
  );
};

export default CreationAlert;
