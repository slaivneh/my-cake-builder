function Modal({ title, children }) {
  return (
    <div className="border rounded p-3 bg-white">
      <h5>{title}</h5>
      {children}
    </div>
  );
}

export default Modal;
