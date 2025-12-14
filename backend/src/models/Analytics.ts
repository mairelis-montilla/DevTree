import mongoose, { Schema, Document, Types } from 'mongoose';

// Interfaz para TypeScript (Intellisense)
export interface IAnalytics extends Document {
    user: Types.ObjectId; // Referencia a tu Usuario (Dueño del perfil)
    type: 'visit' | 'click'; // Tipo de evento
    link?: string; // La URL a la que dieron click (opcional si es visita)
    device: string; // 'Mobile', 'Desktop', etc.
    browser: string; // 'Chrome', 'Safari', etc.
    country?: string; // Opcional: Podrías implementarlo a futuro
    date: Date;
}

// Esquema de Mongoose
const AnalyticsSchema = new Schema({
    user: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', // ¡Aquí conecta con tu modelo User.ts!
        required: true 
    },
    type: { 
        type: String, 
        enum: ['visit', 'click'], // Validación estricta
        required: true 
    },
    link: { 
        type: String, // Guardamos la URL o el ID del link clickeado
        default: ''
    },
    device: { 
        type: String, 
        default: 'Unknown' 
    },
    browser: { 
        type: String, 
        default: 'Unknown' 
    },
    country: { 
        type: String, 
        default: 'Unknown' 
    },
    date: { 
        type: Date, 
        default: Date.now 
    }
});

// Índice para hacer las consultas rápidas (Bonus de performance)
AnalyticsSchema.index({ user: 1, date: 1 });

const Analytics = mongoose.model<IAnalytics>('Analytics', AnalyticsSchema);
export default Analytics;