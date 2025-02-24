const Footer = () => {
  return (
    // <nav className="bg-[#bfaea4]">
    <footer className="flex justify-center bg-[#1a0301] p-2 text-center text-white">
      <small className="px-2 border-r border-[#fff]">
        &copy; {new Date().getFullYear()}{" "}
        <strong className="font-[600]">Food Hub</strong>. All Rights Reserved.
      </small>
      <small className="px-2">
        Developed by{" "}
        <strong className="font-[600]">HSquare Development </strong>
      </small>
    </footer>
  );
};

export default Footer;
