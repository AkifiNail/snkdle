import { useEffect , useState } from "react"
import Input from './input'

export default function Fetch() {


    const [data , setData] = useState([])
    const [value , setValue] = useState('')   
    const [randomCharacter, setRandomCharacter] = useState(null);  
    const [isloaded , setIsloaded] = useState(false)
    const [win, setWin] = useState(false)

    const [attempt , setAttempt] = useState(0)
    const [ChoseCharacter , setChoseCharacter] = useState([])
    const [variation , setVariation] = useState('')

    useEffect(() => {

        const fetchData = async () => {
            try {
                const response = await fetch('./src/assets/data.json');
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const jsonData = await response.json();
                setData(jsonData.characters || []); 
                setIsloaded(true);
            } catch (err) {
                console.error(err);
                setError('Failed to load data');
            }
        };
        fetchData();
    }, []);

    useEffect(() => {
            if (data.length > 0) { 
                const randomIndex = Math.floor(Math.random() * data.length);
                setRandomCharacter(data[randomIndex]);
            }else{
                console.log("no data")
            }
    } , [data])

    function CheckIfTrue(data) {
        setChoseCharacter((prev) => [...prev, data]);
        setAttempt(attempt + 1);
        if (randomCharacter && data.id === randomCharacter.id) {
            console.log("L'ID correspond !");
            console.log(data.Season , randomCharacter.Season)
            setWin(true);
        }

        const attribute = ['Attribut', 'Genre', 'Life', 'Lieu'];

        attribute.forEach((attr) => {
            if (randomCharacter && data[attr] === randomCharacter[attr]) {
                console.log(`L'${attr} correspond !`);
            }
        });
      
        if (randomCharacter &&  parseInt(data.Season) > parseInt(randomCharacter.Season)) {
            console.log("La saison est plus grande !");
        }else if (randomCharacter &&  parseInt(data.Season) < parseInt(randomCharacter.Season)) {
            console.log("La saison est plus petite !");
        }else if (randomCharacter &&  parseInt(data.Season) === parseInt(randomCharacter.Season)) {
            console.log("La saison est égale !");
        }
       
        if (randomCharacter && (
            data.id !== randomCharacter.id &&
            data.Attribut !== randomCharacter.Attribut &&
            data.Genre !== randomCharacter.Genre &&
            data.Life !== randomCharacter.Life &&
            data.season !== randomCharacter.season &&
            data.Lieu !== randomCharacter.Lieu
        )) {
            console.log("Aucune correspondance !");
        }
    }

    function getStyle(attribute, value) {
        if (!randomCharacter) return '';
        return randomCharacter[attribute] === value ? 'green' : 'red';
    }
    function getSaison(attribute, value) {
        if (!randomCharacter) return '';
        if (randomCharacter[attribute] === value) {
            return 'green';
        } else if (randomCharacter[attribute] > value) {
            return 'red';
        } else if (randomCharacter[attribute] < value) {
            return 'red';
        }
    }
    
    
    const filteredData = data.filter(data => data.Name.toLowerCase().includes(value.toLowerCase()))


    return (
        <>
        <Input value={value} onChange={setValue} placeholder='search' />
        <ul> {filteredData.map(data => {
           return <button onClick={() => CheckIfTrue(data)} key={data.id}>{data.Name}</button>
        }) }</ul>
        {/* {randomCharacter && (
                <p>Random Character: {randomCharacter.Name}</p>
            )} */}

            <p>Essai : {attempt}</p>

            {Array.isArray(ChoseCharacter) && ChoseCharacter.map((data) => {
                const variationSymbol = randomCharacter && randomCharacter.Season > data.Season 
                ? '↑' 
                : randomCharacter && randomCharacter.Season < data.Season 
                ? '↓' 
                : '';
                return (
                    <div key={data.id} className="d-flex gap-3">
                         <p className={getStyle('Name', data.Name)}>{data.Name}</p>
                         <p className={getStyle('Season', data.Season)}>Saison {data.Season} {variationSymbol}</p>
                         <p className={getSaison('Attribut', data.Attribut)}>{data.Attribut}  </p>
                        <p className={getStyle('Genre', data.Genre)}>{data.Genre}</p>
                         <p className={getStyle('Life', data.Life)}>{data.Life ? 'Vivant' : 'Mort'}</p>
                        <p className={getStyle('Lieu', data.Lieu)}>{data.Lieu}</p>
                    </div>
                )
            })}
        </>      
    )
}
