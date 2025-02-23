const CustomGroup = ({ data, id, }) => {
  return (
    <div id={id} className="text-white text-center">
      <p>{data.label}</p>
    </div>
  );
};

export default CustomGroup;