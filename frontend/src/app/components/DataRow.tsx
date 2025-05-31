interface DataRowProps {
    title: string | null;
    data: number | string | null;
    unit?: string | null;
}

export default function DataRow({ title, data, unit }: DataRowProps) {
    return (
        <div className="flex justify-between">
            <span>{title}</span>
            <span className="row_value">
                <span>{data !== null ? data : 'N/A'}</span>
                <span>{unit ? ` ${unit}` : ''}</span>
            </span>
        </div>
    );
}