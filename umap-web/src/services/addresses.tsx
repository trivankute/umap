export default async function getAddresses() {
    try {
        const response = await fetch('http://localhost:3001/address');
        const data = await response.json();
        return data
      } catch (error) {
        console.error("Error fetching address:", error);
        return []
      }
}