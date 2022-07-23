export const getExerciseGroup = async (req, res) => {
    const { id } = req.params
    console.log("id: ", id);
    try {
        res.status(200).json({ message: 'You are authentificated, so its oke'});
        

    } catch (error) {
        console.log(error);
        res.status(500).json({message: 'Something went wrong'});
    }
}