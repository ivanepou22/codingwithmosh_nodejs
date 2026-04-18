import mongoose from "mongoose";
import _ from "lodash";
import { ErrorLog } from "../models/errorLogModel.js";
import { asyncMiddleware } from "../middleware/async.js";

export const getErrorLogs = asyncMiddleware(async (req, res) => {
    const { level, startDate, endDate, limit = 50, skip = 0 } = req.query;
    
    const query = {};
    
    if (level) {
        query.level = level;
    }
    
    if (startDate || endDate) {
        query.timestamp = {};
        if (startDate) query.timestamp.$gte = new Date(startDate);
        if (endDate) query.timestamp.$lte = new Date(endDate);
    }
    
    const errorLogs = await ErrorLog.find(query)
        .sort({ timestamp: -1 })
        .limit(parseInt(limit))
        .skip(parseInt(skip));
    
    const total = await ErrorLog.countDocuments(query);
    
    res.send({
        total,
        page: Math.ceil(skip / limit) + 1,
        limit: parseInt(limit),
        data: errorLogs
    });
});

export const getErrorLog = asyncMiddleware(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid log ID');
    }
    
    const errorLog = await ErrorLog.findById(req.params.id);
    if (!errorLog) {
        return res.status(404).send('Error log not found');
    }
    
    res.send(errorLog);
});

export const deleteErrorLog = asyncMiddleware(async (req, res) => {
    if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
        return res.status(400).send('Invalid log ID');
    }
    
    const errorLog = await ErrorLog.findByIdAndDelete(req.params.id);
    if (!errorLog) {
        return res.status(404).send('Error log not found');
    }
    
    res.send(errorLog);
});

export const clearOldLogs = asyncMiddleware(async (req, res) => {
    const { days = 30 } = req.query;
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - parseInt(days));
    
    const result = await ErrorLog.deleteMany({
        timestamp: { $lt: cutoffDate }
    });
    
    res.send({ 
        message: `Deleted ${result.deletedCount} old error logs`,
        deletedCount: result.deletedCount 
    });
});

export const getErrorLogStats = asyncMiddleware(async (req, res) => {
    const stats = await ErrorLog.aggregate([
        {
            $group: {
                _id: "$level",
                count: { $sum: 1 },
                latest: { $max: "$timestamp" }
            }
        },
        {
            $sort: { count: -1 }
        }
    ]);
    
    const total = await ErrorLog.countDocuments();
    const recent24Hours = await ErrorLog.countDocuments({
        timestamp: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
    });
    
    res.send({
        total,
        recent24Hours,
        byLevel: stats
    });
});
