import { useState, useEffect } from "react";
import SocialLogo from "./socia-logo";
import LinkConstructor from "./link-constructor";

const ConfirmationAlert = ({
  collectionImg,
  itemImg,
  links,
  collectionName,
  collectionDescription,
  itemName,
  itemPrice,
  itemsLimit,
  nextStep,
}: any) => {
  const [linksNames, setLinksNames] = useState(Array(links.length).fill(""));

  useEffect(() => {
    return () => {
      // Call nextStep on unmount, passing the linksNames array
      nextStep(linksNames);
    };
  }, [linksNames, nextStep]);

  const handleLinkNameChange = (index: number, value: any) => {
    const newLinksNames = [...linksNames];
    newLinksNames[index] = value;
    setLinksNames(newLinksNames);
  };

  return (
    <div className="create-alert-wrapper">
      <section className="mint-main-bg">
        <div className="image-container both-images">
          <img
            className="both-images__collection"
            src={collectionImg}
            alt={collectionName}
          />
          <img className="both-images__item" src={itemImg} alt={itemName} />
        </div>
        <h1>{collectionName}</h1>
        <div className="description muted">{collectionDescription}</div>
        {links.length > 0 && (
          <div className="links-container">
            {links.map((url: string, index: number) => (
              <div key={index} className="link">
                <SocialLogo className="link-img" url={url} />
                {linksNames[index] || url}
              </div>
            ))}
          </div>
        )}
      </section>

      <div className="card">
        <div className="card-row">
          <div className="card-row__left">Items</div>
          <div className="card-row__right">
            {itemsLimit === "" || itemsLimit === 0 ? "∞" : itemsLimit}
          </div>
        </div>
        <div className="card-row">
          <div className="card-row__left">Price</div>
          <div className="card-row__right">{itemPrice} TON</div>
        </div>
      </div>

      {links.length > 0 && (
        <div className="card">
          {links.map((link: any, index: number) => (
            <LinkConstructor
              key={index}
              inputField={linksNames[index]}
              url={link}
              placeholder={link}
              remove={false}
              onInputFieldChange={(value: any) =>
                handleLinkNameChange(index, value)
              }
            />
          ))}
        </div>
      )}

      {links.length > 0 && (
        <p className="instruction muted mb-0">
          You can specify a display name for each link
        </p>
      )}
    </div>
  );
};

export default ConfirmationAlert;
