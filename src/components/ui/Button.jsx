export default function Button({ children, ...props }) {
  return (
    <button
      className="px-3 py-1 rounded-md border text-sm hover:bg-gray-100"
      {...props}
    >
      {children}
    </button>
  )
}

