import { View, Text, FlatList, TouchableOpacity, StyleSheet, TextInput } from 'react-native';
import { format } from 'date-fns';
import Layout from "../Template/Layout";
import Modal_Global from "../moleculas/Modal_Global";
import { usePersonas } from "../../Context/ContextPersonas.jsx";
import FormNovedad from "../moleculas/FormNovedad.jsx";
import ComponentSeguimiento from "../moleculas/ComponentSeguimiento.jsx";
import SeguimientosContext from "../../Context/ContextSeguimiento.jsx";
import { useContext, useEffect, useMemo, useState } from 'react';

const Seguimientos = () => {
    const { rol } = usePersonas();
    const { seguimientos, getSeguimientos, getSeguimiento } = useContext(SeguimientosContext);
    const [filterValue, setFilterValue] = useState("");
    const [selectedSeguimientoId, setSelectedSeguimientoId] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSeguimientos = async () => {
            try {
                await getSeguimientos();
                setLoading(false);
            } catch (error) {
                console.error('Error al obtener los seguimientos:', error);
                setError("Error al obtener los seguimientos: " + error.message);
                setLoading(false);
            }
        };
        fetchSeguimientos();
    }, [getSeguimientos]);

    const handleOpenModal = async (id_seguimiento, componentName) => {
        setSelectedComponent(componentName);
        setSelectedSeguimientoId(id_seguimiento);
        setModalVisible(true);

        if (componentName.startsWith("ComponentSeguimiento")) {
            try {
                await getSeguimiento(id_seguimiento);
            } catch (error) {
                console.error("Error al obtener el seguimiento:", error);
            }
        }
    }

    const handleCloseModal = () => {
        setModalVisible(false);
        setSelectedComponent(null);
        setSelectedSeguimientoId(null);
    };

    const filteredItems = useMemo(() => {
        return seguimientos.filter(seg =>
            seg.seguimiento.toLowerCase().includes(filterValue.toLowerCase())
        );
    }, [seguimientos, filterValue]);

    const renderItem = ({ item }) => {
        const formatDate = (date) => {
            return date ? format(new Date(date), 'dd-MM-yyyy') : "Fecha no disponible";
        };
        return (
            <View style={styles.item}>
                <Text style={styles.itemText}>Seguimiento: {item.seguimiento}</Text>
                <Text style={styles.itemText}>Instructor: {item.instructor || 'No asignado'}</Text>
                <Text style={styles.itemText}>Productiva: {item.productiva}</Text>
                <Text style={styles.itemText}>Estado: {item.estado}</Text>
                <Text style={styles.itemText}>Fecha inicio: {formatDate(item.fecha)}</Text>

                {[1, 2, 3].map((num) => (
                    <TouchableOpacity
                        key={num}
                        style={styles.button}
                        onPress={() => handleOpenModal(item.id_asignacion, `ComponentSeguimiento${num}`)}
                    >
                        <Text style={styles.buttonText}>Seguimiento {num} - {formatDate(item.fecha)}</Text>
                    </TouchableOpacity>
                ))}

                {rol !== "Aprendiz" && (
                    <TouchableOpacity
                        style={styles.novedadButton}
                        onPress={() => handleOpenModal(null, "FormNovedad")}
                    >
                        <Text style={styles.novedadButtonText}>Registrar Novedad</Text>
                    </TouchableOpacity>
                )}
            </View>
        );
    };

    if (loading) {
        return (
            <Layout title={"Seguimientos"}>
                <View style={styles.container}>
                    <Text>Cargando...</Text>
                </View>
            </Layout>
        );
    }

    if (error) {
        return (
            <Layout title={"Seguimientos"}>
                <View style={styles.container}>
                    <Text>{error}</Text>
                </View>
            </Layout>
        );
    }

    return (
        <Layout title={"Seguimientos"}>
            <View style={styles.container}>
                <TextInput
                    style={styles.searchInput}
                    placeholder="Buscar seguimiento..."
                    value={filterValue}
                    onChangeText={setFilterValue}
                />
                <FlatList
                    data={filteredItems}
                    renderItem={renderItem}
                    keyExtractor={(item) => item.id_seguimiento.toString()}
                />
                <Modal_Global visible={modalVisible} onClose={handleCloseModal}>
                    {selectedComponent && selectedComponent.startsWith("ComponentSeguimiento") && (
                        <ComponentSeguimiento
                            id_seguimiento={selectedSeguimientoId}
                            numero={selectedComponent.slice(-1)}
                        />
                    )}
                    {selectedComponent === "FormNovedad" && <FormNovedad />}
                </Modal_Global>
            </View>
        </Layout>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
    },
    searchInput: {
        height: 40,
        borderColor: 'gray',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 10,
        borderRadius: 5,
    },
    item: {
        padding: 16,
        marginVertical: 8,
        backgroundColor: '#f9f9f9',
        borderRadius: 8,
    },
    itemText: {
        fontSize: 16,
        marginBottom: 4,
    },
    button: {
        backgroundColor: '#FFA000',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
    novedadButton: {
        backgroundColor: '#4CAF50',
        padding: 12,
        borderRadius: 5,
        marginTop: 10,
        alignItems: 'center',
    },
    novedadButtonText: {
        color: 'white',
        fontSize: 16,
        fontWeight: 'bold',
    },
});

export default Seguimientos;